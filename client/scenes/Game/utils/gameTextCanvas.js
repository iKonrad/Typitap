export default class GameTextCanvas {
    constructor(element) {
        this.canvas = element;
        this.canvas.width = this.canvas.parentElement.clientWidth - 40;
        this.c = this.canvas.getContext('2d');
        this.lineHeight = 22;
        this.wordPadding = 2;
        this.textMargin = 15;
        this.highlightedColor = "#8adfff";
        this.errorColor = "#ff8a7a";
        this.fontColor = "black";
    }

    updateText(text, index, hasError) {
        this.canvas.width = this.canvas.parentElement.clientWidth - 40;

        let that = this;
        let words = text.split(' ');

        let maxWidth = this.canvas.width;
        let x = 0;
        let y = this.textMargin;

        this.c.font = 'normal 400 18px Source Sans Pro';
        this.c.fillStyle = this.fontColor;

        let line = '';
        let currentLine = 1;
        let activeLine = '';

        /* Iterate through all words to:
           - Wrap words to fit into the box
           - Draw a highlight box under the current index */
        for(let n = 0; n < words.length; n++) {
            this.c.fillStyle = this.fontColor;
            let activeLine = line + words[n] + ' ';
            let activeLineWidth = this.c.measureText(activeLine).width;

            if (activeLineWidth > maxWidth && n > 0) {
                currentLine += 1;
                this.c.fillText(line, x, y);
                line = words[n] + ' ';
                y += that.lineHeight;
            }
            else {
                line = activeLine;
            }

            // If current index is the active one, draw a highlight box
            if (n === index) {
                // Get the current line and remove the last word
                let completedLine = line.trim().split(" ").slice(0, -1);
                let completedText = completedLine.join(" ");

                // If the current word is the first one, don't add a space
                completedText = completedLine.length > 0 ? completedText + " " : completedText;

                // Get the line width to determine where to draw a highlight box
                let completedWidth = this.c.measureText(completedText).width;
                let wordWidth = this.c.measureText(words[n]);

                // Draw a highlight box and change the colour back to black
                this.c.fillStyle = hasError ? this.errorColor : this.highlightedColor;
                // this.c.fillRect(completedWidth - this.wordPadding, ((currentLine - 1) * this.lineHeight) - this.wordPadding, wordWidth.width + (this.wordPadding * 2), this.lineHeight + (this.wordPadding));
                this.drawHighlight(completedWidth - this.wordPadding, ((currentLine - 1) * this.lineHeight) - this.wordPadding, wordWidth.width + (this.wordPadding * 2), this.lineHeight + (this.wordPadding), 4)
                this.c.fillStyle = this.fontColor;
            }
        }

        this.c.fillText(line, x, y);
        this.c.fillStyle = this.fontColor;
    }


    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    drawHighlight(x, y, width, height, radius) {
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        this.c.beginPath();
        this.c.moveTo(x + radius.tl, y);
        this.c.lineTo(x + width - radius.tr, y);
        this.c.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        this.c.lineTo(x + width, y + height - radius.br);
        this.c.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        this.c.lineTo(x + radius.bl, y + height);
        this.c.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        this.c.lineTo(x, y + radius.tl);
        this.c.quadraticCurveTo(x, y, x + radius.tl, y);
        this.c.closePath();
        this.c.fill();
    }

}