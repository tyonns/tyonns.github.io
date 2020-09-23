class Field{
    constructor(fieldCanvas){
        //Geometric Parameter
        this.width=fieldCanvas.canvas.width;
        this.height=fieldCanvas.canvas.height;
        this.area = this.width*this.height;
        this.center_x = this.width/2;
        this.center_y = this.height/2;
        this.fieldImgData = fieldCanvas.ct.getImageData(0,0,this.width,this.height);

        //Solar Radiation Parameter
        this.totalRadiantFlux = 3000;      //[J/s]
        this.radiationRadius = 90;     //[pixels]
        this.solarRevolutionRadius = this.width/2-this.radiationRadius;//[pixels]
        this.energy = new Array(this.area).fill(0);

        //Guassian Distribution Parameter
        this.arraySideLength = 30;      //[elements]
        this.gaussianMagnifier = this.radiationRadius/this.arraySideLength;//[pixels/elements]
        this.varianceAtEdge = 3;        //[sigma]
        this.solarIrradiance = new Array(Math.pow(this.arraySideLength,2));
        this.getGaussDistribution(this.solarIrradiance);
    }
    getGaussDistribution(gaussianDistribution){
        /*-----------INFO ABOUT GAUSSIAN DISTRIBUTION-----------*/
        /*
        2D gaussian function f(x,y) can be expressed as
            f(x,y) = A exp ( -{((x-x_0)**2)/(2σx**2)+((y-y_0)**2)/(2σy**2)})
        Where A is the amplitude, x_0,y_0 are the center and σx and σy are the spread.
        The Volume is given by
            V = 2π*A*σx*σy
        */
        const sigma_xy_element = this.arraySideLength/this.varianceAtEdge;
        let totalRadiantFluxMeasured = 0;
        //Calculate Gaussian Distribution without consideration of A
        for(let iGauss=0;iGauss<gaussianDistribution.length;iGauss++){
            const xGauss = iGauss%this.arraySideLength;
            const yGauss = Math.floor(iGauss/this.arraySideLength);
            gaussianDistribution[iGauss] = Math.exp(-( Math.pow(xGauss,2)/(2*Math.pow(sigma_xy_element,2))+Math.pow(yGauss,2)/(2*Math.pow(sigma_xy_element,2)) ));
            totalRadiantFluxMeasured += 4*gaussianDistribution[iGauss]*Math.pow((this.radiationRadius/this.arraySideLength),2);
        }
        //Multiply each element by A to adjust the totalRadiantFlux (Q_in);
        const A = this.totalRadiantFlux/totalRadiantFluxMeasured;
        totalRadiantFluxMeasured = 0;
        for(let iGauss=0;iGauss<gaussianDistribution.length;iGauss++){
            gaussianDistribution[iGauss] *= A;
            totalRadiantFluxMeasured += 4*gaussianDistribution[iGauss]*Math.pow((this.radiationRadius/this.arraySideLength),2);
        }

    }
    updateField(time){
        this.updateSunPosition(time);
        this.calculateSolarIrradiance();
    }
    updateSunPosition(time){
        const theta = (time/60)*2 * Math.PI;
        this.sunX = Math.floor(this.center_x+this.solarRevolutionRadius*Math.cos(theta));
        this.sunY = Math.floor(this.center_y+this.solarRevolutionRadius*Math.sin(theta));
    }
    calculateSolarIrradiance(){
        let totalRadiantFluxMeasured=0;
        for(let iGauss=0;iGauss<this.solarIrradiance.length;iGauss++){
            let dx = iGauss%this.arraySideLength*this.gaussianMagnifier;
            let dy = Math.floor(iGauss/this.arraySideLength)*this.gaussianMagnifier;
            const irradiance = this.solarIrradiance[iGauss];
            for(let iDir=0;iDir<4;iDir++){
                let xSign = Math.sign(1/dx);
                let ySign = Math.sign(1/dy);
                for(let xMag=0;xMag<this.gaussianMagnifier;xMag++){
                    const xindex = this.sunX+dx+xMag*xSign+Math.min(xSign,0);
                    for(let yMag=0;yMag<this.gaussianMagnifier;yMag++){
                        const yindex = this.sunY+dy+yMag*ySign+Math.min(ySign,0);
                        const index  = yindex*this.width+xindex;
                        this.energy[index] += irradiance;
                        totalRadiantFluxMeasured += irradiance;
                    }
                }
                //Rotate by 90 deg
                const dx_save = dx;
                dx = -dy;
                dy = dx_save;
            }
        }

    }
    drawField(canvas){
        for(let i=0;i<this.energy.length;i++){
            const y=Math.floor(i/this.width);
            const x=i%this.width;
            this.fieldImgData.data[i*4+0]=this.energy[i];
            this.fieldImgData.data[i*4+1]=this.energy[i];
            this.fieldImgData.data[i*4+2]=this.energy[i];
        }
        canvas.ct.putImageData(this.fieldImgData,0,0);
    }
    changeEnergy(x,y,energyAdded){
        this.energy[x+y*this.width] += energyAdded;
    }
}

console.log("Loaded: grass.js");