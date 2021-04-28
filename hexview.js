/* Version: 0.1.0 - April 28, 2021 08:36:57 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.hexview = factory());
}(this, (function () { 'use strict';

    var HexView = /** @class */ (function () {
        function HexView(config) {
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
            this.flashTimer = setTimeout(function () { }, 1); // dummy
            this.flashTime = config.flashTime;
            this.element.appendChild((function (self) {
                var box = document.createElement('div');
                box.style.display = 'table';
                box.classList.add('hexview');
                box.appendChild(self.createLineNumbers());
                box.appendChild(self.createBody(self.data));
                return box;
            })(this));
        }
        HexView.prototype.update = function (newData) {
            var tbl = this.element.querySelector('.body');
            for (var i = 0; i < this.getRowsCount(newData); ++i) {
                var row = tbl.rows[i];
                for (var j = 0; j < this.columnsCount; ++j) {
                    if (this.data.length <= i * this.columnsCount + j) {
                        break;
                    }
                    if (newData.length <= i * this.columnsCount + j) {
                        break;
                    }
                    var cell = row.cells[j];
                    var oldVal = this.data[i * this.columnsCount + j] & 0xff;
                    var newVal = newData[i * this.columnsCount + j] & 0xff;
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
                this.flashTimer = setTimeout(function (self) {
                    for (var i = 0; i < self.getRowsCount(self.data); ++i) {
                        var row = tbl.rows[i];
                        for (var j = 0; j < self.columnsCount; ++j) {
                            if (self.data.length <= i * self.columnsCount + j) {
                                break;
                            }
                            row.cells[j].classList.remove('flash');
                        }
                    }
                }, this.flashTime, this);
            }
        };
        HexView.prototype.createLineNumbers = function () {
            var tbl = document.createElement('table');
            tbl.style.display = 'table-cell';
            tbl.classList.add('line-numbers');
            for (var i = 0; i < this.getRowsCount(this.data); ++i) {
                tbl
                    .insertRow()
                    .insertCell()
                    .innerText = HexView.getDataStr(i, 4);
            }
            return tbl;
        };
        HexView.prototype.createBody = function (data) {
            var tbl = document.createElement('table');
            tbl.style.display = 'table-cell';
            tbl.classList.add('body');
            for (var i = 0; i < this.getRowsCount(data); ++i) {
                var row = tbl.insertRow();
                for (var j = 0; j < this.columnsCount; ++j) {
                    var cell = row.insertCell();
                    if (data.length <= i * this.columnsCount + j) {
                        cell.innerText = '..';
                    }
                    else {
                        cell.innerText = HexView.getDataStr(data[i * this.columnsCount + j] & 0xff, 2);
                    }
                }
            }
            return tbl;
        };
        HexView.prototype.getRowsCount = function (data) {
            return Math.ceil(data.length / this.columnsCount);
        };
        HexView.getDataStr = function (num, digits) {
            var str = num.toString(16);
            while (str.length < digits) {
                str = "0" + str;
            }
            return str;
        };
        return HexView;
    }());
    var hexview = {
        version: '0.1.0',
        generate: function (config) {
            return new HexView(config);
        }
    };

    return hexview;

})));
