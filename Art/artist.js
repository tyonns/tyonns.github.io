class Artist {
    constructor(width, height, temperature, humidity, percipitationChance, windSpeed) {
        this.width = width;
        this.height = height;
        this.area = this.width*this.height;
        this.temperature = temperature;
        this.humidity = humidity;
        this.percipitationChance = percipitationChance;
        this.windSpeed = windSpeed;
        this.isPixelColored = new Array(this.area).fill(false);
        this.colorRed = randomInt(255);
        this.colorGreen = randomInt(255);
        this.colorBlue = randomInt(255);
        this.pixelIndex = randomInt(this.area);
        this.colorToIncrement = randomInt(2);
        this.plusMinusVal = 2;
        this.circleNumber = (this.plusMinusVal*2 + 1)**2 -1;

    }

    changePixel() {

        this.changePixelLocation();
        this.changePixelColor();
    }

    changePixelLocation() {
        let [previousX, previousY] = i2xy(this.pixelIndex, this.width)
        //console.log(this.pixelIndex);
        let totalIncrement = 0;
        let surroundingIndex = randomInt(this.circleNumber-1);
        let isChangeLocation = false;
        let newLocation;


        while (true)
        {
            //console.log("strt whil");
            surroundingIndex = (surroundingIndex + totalIncrement) % this.circleNumber;
            if (surroundingIndex >= this.circleNumber/2) surroundingIndex += 1;
            let [deltaX, deltaY] = i2xy(surroundingIndex,(this.plusMinusVal*2+1));
            let newX = previousX + deltaX - this.plusMinusVal;
            let newY = previousY + deltaY - this.plusMinusVal;
            newX = Math.max(newX,0);
            newY = Math.max(newY,0);
            newX = Math.min(newX,this.width);
            newY = Math.min(newY,this.height);
            //console.log([deltaX - 2, deltaY - 2]);
            newLocation = xy2i([newX, newY], this.width);
            //console.log(newLocation);
            if (!this.isPixelColored[newLocation]){
                break
            }else if(totalIncrement>=this.circleNumber) {
                newLocation = randomInt(this.width*this.height);
                while(this.isPixelColored[newLocation]){
                    newLocation = (newLocation + 1) % this.area;
                }
                isChangeLocation = true;
                break
            }
            
            totalIncrement++;
        }

        this.pixelIndex = newLocation;
        this.isPixelColored[newLocation] = true;
        if (isChangeLocation){
            this.colorToIncrement = (this.colorToIncrement + 1) % 3;
            //console.log(this.colorToIncrement)
        }
            
        
    }

    changePixelColor(previousRGB, index) {
        if (this.colorToIncrement == 0){
            this.colorRed = (this.colorRed + 1) % 256 ;
        } else if (this.colorToIncrement == 1){
            this.colorGreen = (this.colorGreen + 1) % 256 ;
        } else{
            this.colorBlue = (this.colorBlue + 1) % 256 ;
        }
        console.log([this.colorRed,this.colorGreen,this.colorBlue]);
        

    }

    drawPixel(fieldImgData){
        //console.log(this.pixelIndex);
        fieldImgData.data[this.pixelIndex*4+0]=this.colorRed;
        fieldImgData.data[this.pixelIndex*4+1]=this.colorGreen;
        fieldImgData.data[this.pixelIndex*4+2]=this.colorBlue;
    }

}