class Artist {
    constructor(width, height, temperature, humidity, percipitationChance, windSpeed) {
        this.width = width;
        this.height = height;
        this.area = this.width * this.height;
        this.temperature = temperature;
        this.humidity = humidity;
        this.percipitationChance = percipitationChance;
        this.windSpeed = windSpeed;
        this.isPixelColored = new Array(this.area).fill(false);
        this.pixelColor = [randomInt(255), randomInt(255), randomInt(255)]; // r g b 
        this.pixelToPaint = randomInt(this.area);
        this.pixelToMoveFrom = randomInt(this.area);
        this.rgbIndex = randomInt(2);
        this.colorCounter = 0;
        this.colorIncrement = [1,1,1]; //r g b
        this.pixelChangePErcent = 1/randomInt(1000);


    }

    changePixel() {

        this.changePixelLocation();
        this.changePixelColor();
    }

    changePixelLocation() {
        
        const [previousX, previousY] = i2xy(this.pixelToMoveFrom, this.width)
        if (this.isPixelColored.every(Boolean)) return;

        let relativeX;
        let relativeY;
        let newX;
        let newY;
        let maxPixelAway = 1;

        while (this.isPixelColored[this.pixelToPaint]) {

            let circumference = maxPixelAway * 8;
            let circumIndex = randomInt(circumference);
            //console.log(circumIndex);
            let circumCounter = 0;

            while (circumCounter < circumference && this.isPixelColored[this.pixelToPaint]) {

                [relativeX, relativeY] = this.convertRadInd2XY(circumIndex, maxPixelAway, circumference);
                newX = Math.max(previousX + relativeX, 0);
                newY = Math.max(previousY + relativeY, 0);
                newX = Math.min(newX, this.width);
                newY = Math.min(newY, this.height);
                this.pixelToPaint = xy2i([newX, newY], this.width);

                circumIndex = (circumIndex + 1) % circumference;
                circumCounter++;

            }

            //console.log(maxPixelAway);
            maxPixelAway++;

        }
        if (Math.random()<this.pixelChangePErcent){
            this.pixelToMoveFrom = this.pixelToPaint;
            this.pixelChangePErcent = 1 / randomInt(3000)
        }
    }

    convertRadInd2XY(index, maxPixelAway, totalPixels) {
        let diameter = maxPixelAway * 2 + 1;
        let relativeY;
        let relativeX;
        if (index < diameter) {
            relativeY = - maxPixelAway;
            relativeX = index - maxPixelAway;
        } else if (index < (totalPixels - diameter)) {
            relativeX = maxPixelAway * (-1) ** index;
            relativeY = Math.floor((index - diameter) / 2) - maxPixelAway + 1;
        } else if (index < totalPixels) {
            relativeY = maxPixelAway;
            relativeX = index - totalPixels + maxPixelAway + 1;
        }
        //console.log(maxPixelAway);
        //console.log(index);
        //console.log([relativeX, relativeY]);
        return [relativeX, relativeY];
    }

    changePixelColor(){
        let randomColor = randomInt(2);
        let maxColorDif = 10;
        if (Math.abs(this.pixelColor[this.rgbIndex] - this.pixelColor[(this.rgbIndex+1)%3])>maxColorDif || Math.abs(this.pixelColor[this.rgbIndex] - this.pixelColor[(this.rgbIndex+2)%3])>maxColorDif){
            this.rgbIndex = (this.rgbIndex + randomColor) % 3;
        }
            
        let changeValue = 1 + Math.random()*2;
        let whichrgb = 0;

        this.pixelColor[(this.rgbIndex+whichrgb)%3] = this.pixelColor[(this.rgbIndex+whichrgb)%3] + this.colorIncrement[(this.rgbIndex+whichrgb)%3];

        if (this.pixelColor[(this.rgbIndex+whichrgb)%3] >= 255 || this.pixelColor[(this.rgbIndex+whichrgb)%3] <=0)
            this.colorIncrement[(this.rgbIndex+whichrgb)%3] *= -1;

        console.log(this.pixelColor);

    }

    drawPixel(fieldImgData) {
        //console.log(this.pixelToPaint);
        if (this.isPixelColored[(this.pixelToPaint+1)%this.area]){
            fieldImgData.data[this.pixelToPaint * 4 + 0] = (fieldImgData.data[(this.pixelToPaint+1) * 4 + 0] + this.pixelColor[0])/2;
            fieldImgData.data[this.pixelToPaint * 4 + 1] = (fieldImgData.data[(this.pixelToPaint+1) * 4 + 1] + this.pixelColor[1])/2;
            fieldImgData.data[this.pixelToPaint * 4 + 2] = (fieldImgData.data[(this.pixelToPaint+1) * 4 + 2] + this.pixelColor[2])/2;
        }else{

        
        fieldImgData.data[this.pixelToPaint * 4 + 0] = this.pixelColor[0];
        fieldImgData.data[this.pixelToPaint * 4 + 1] = this.pixelColor[1];
        fieldImgData.data[this.pixelToPaint * 4 + 2] = this.pixelColor[2];
        }



        this.isPixelColored[this.pixelToPaint] = true;
    }

}