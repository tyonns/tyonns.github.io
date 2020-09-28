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
        this.pixelIndex = randomInt(this.area);
        this.rgbIndex = randomInt(2);
        this.colorCounter = 0;
        this.colorIncrement = [1,1,1]; //r g b


    }

    changePixel() {

        this.changePixelLocation();
        this.changePixelColor();
    }

    changePixelLocation() {
        const [previousX, previousY] = i2xy(this.pixelIndex, this.width)
        if (this.isPixelColored.every(Boolean)) return;

        let relativeX;
        let relativeY;
        let newX;
        let newY;
        let maxPixelAway = 1;

        while (this.isPixelColored[this.pixelIndex]) {

            let circumference = maxPixelAway * 8;
            let circumIndex = randomInt(circumference);
            let circumCounter = 0;

            while (circumCounter < circumference && this.isPixelColored[this.pixelIndex]) {

                [relativeX, relativeY] = this.convertRadInd2XY(circumIndex, maxPixelAway, circumference);
                newX = Math.max(previousX + relativeX, 0);
                newY = Math.max(previousY + relativeY, 0);
                newX = Math.min(newX, this.width);
                newY = Math.min(newY, this.height);
                this.pixelIndex = xy2i([newX, newY], this.width);

                circumIndex = (circumIndex + 1) % circumference;
                circumCounter++;

            }

            console.log(maxPixelAway);
            maxPixelAway++;

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
        
        let changeValue = 4;
        this.pixelColor[this.rgbIndex] = this.pixelColor[this.rgbIndex] + this.colorIncrement[this.rgbIndex];
        if (this.pixelColor[this.rgbIndex]>=256 || this.pixelColor[this.rgbIndex]<=0)
        {
            this.colorIncrement[this.rgbIndex] *= -1;
            this.pixelColor[(this.rgbIndex + 1)%3] += changeValue * this.colorIncrement[(this.rgbIndex + 1)%3] ;
            this.pixelColor[(this.rgbIndex + 2)%3] += changeValue * this.colorIncrement[(this.rgbIndex + 2)%3] ;
            if (this.pixelColor[(this.rgbIndex + 1)%3]>=256 || this.pixelColor[(this.rgbIndex + 1)%3]<=0){
                this.colorIncrement[(this.rgbIndex + 1)%3] *= -1;
            }
            if (this.pixelColor[(this.rgbIndex + 2)%3]>=256 || this.pixelColor[(this.rgbIndex + 2)%3]<=0){
                this.colorIncrement[(this.rgbIndex + 2)%3] *= -1;
            }
        }

    }

    drawPixel(fieldImgData) {
        console.log(this.pixelIndex);
        fieldImgData.data[this.pixelIndex * 4 + 0] = this.pixelColor[0];
        fieldImgData.data[this.pixelIndex * 4 + 1] = this.pixelColor[1];
        fieldImgData.data[this.pixelIndex * 4 + 2] = this.pixelColor[2];
        this.isPixelColored[this.pixelIndex] = true;
    }

}