interface HexViewConfig {
    bindto: string,
    columns?: number,
    data: ArrayLike<number>,
    flashTime?: number,
}

class HexView {
    private element: HTMLElement;
    private columnsCount: number;
    private data: ArrayLike<number>;
    private flashTimer: number;
    private flashTime?: number;

    constructor(config: HexViewConfig) {
        {
            var elem = document.getElementById(config.bindto);
            if (!elem) {
                // dummy
                this.element = document.createElement('div');
            }
            else {
                this.element = elem;
            }
        }
        this.columnsCount = config.columns ? config.columns : 8;
        this.data = config.data;
        this.flashTimer = setTimeout(function(){}, 1); // dummy
        this.flashTime = config.flashTime;

        this.element.appendChild((function(self) {
            var box = document.createElement('div');
            box.style.display = 'table';
            box.classList.add('hexview');
            box.appendChild(self.createLineNumbers());
            box.appendChild(self.createBody(self.data));
            return box;
        })(this));
    }

    public update(newData: ArrayLike<number>) {
        var tbl:HTMLTableElement = this.element.querySelector('.body')!;
        for(var i=0; i<this.getRowsCount(newData); ++i) {
            var row = tbl.rows[i];
            for(var j=0; j<this.columnsCount; ++j) {
                if (this.data.length <= i*this.columnsCount + j) {
                    break;
                }
                if (newData.length <= i*this.columnsCount + j) {
                    break;
                }

                var cell = row.cells[j];
                const oldVal = this.data[i*this.columnsCount + j] & 0xff;
                const newVal = newData[i*this.columnsCount + j] & 0xff;
                if (oldVal != newVal) {
                    cell.innerText = HexView.getDataStr(newVal & 0xff, 2);
                    
                    if (this.flashTime) {
                        cell.classList.add('flash');
                    }
                }
            }
        }

        this.data = newData;

        if (this.flashTime) {
            clearTimeout(this.flashTimer);
            this.flashTimer = setTimeout(function(self: HexView) {
                for(var i=0; i<self.getRowsCount(self.data); ++i) {
                    var row = tbl.rows[i];
                    for(var j=0; j<self.columnsCount; ++j) {
                        if (self.data.length <= i*self.columnsCount + j) {
                            break;
                        }
                        row.cells[j].classList.remove('flash');
                    }
                }
            }, this.flashTime, this);
        }
    }

    private createLineNumbers(): HTMLElement {
        var tbl = document.createElement('table');
        tbl.style.display = 'table-cell';
        tbl.classList.add('line-numbers');

        for(var i=0; i<this.getRowsCount(this.data); ++i) {
            tbl
                .insertRow()
                .insertCell()
                .innerText = HexView.getDataStr(i, 4);
        }
        return tbl;
    }

    private createBody(data: ArrayLike<number>): HTMLElement {
        var tbl = document.createElement('table');
        tbl.style.display = 'table-cell';
        tbl.classList.add('body');

        for(var i=0; i<this.getRowsCount(data); ++i) {
            var row = tbl.insertRow();
            for(var j=0; j<this.columnsCount; ++j) {
                var cell = row.insertCell();
                if (data.length <= i*this.columnsCount + j) {
                    cell.innerText = '..';
                }
                else {
                    cell.innerText = HexView.getDataStr(data[i*this.columnsCount + j] & 0xff, 2);
                }
            }
        }
        return tbl;
    }

    private getRowsCount(data: ArrayLike<number>) {
        return Math.ceil(data.length / this.columnsCount);
    }

    private static getDataStr(num: number, digits: number): string {
        var str = num.toString(16);
        while(str.length < digits) {
            str = "0" + str;
        }

        return str;
    }
}

var hexview = {
    version: '[VI]{version}[/VI]',

    generate(config: HexViewConfig) {
        return new HexView(config);
    }
};

export { hexview }
