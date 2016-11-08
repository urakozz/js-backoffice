import {Product} from "../_models/product";
export class ProductSorter {
    static sort(a: Product, b: Product): number {

        let aa = ProductSorter.chunkify(a.sku.toLowerCase());
        let bb = ProductSorter.chunkify(b.sku.toLowerCase());

        for (let x = 0; aa[x] && bb[x]; x++) {
            if (aa[x] !== bb[x]) {
                let c = Number(aa[x]), d = Number(bb[x]);
                if (c === aa[x] && d === bb[x]) {
                    return c - d;
                } else {
                    return (aa[x] > bb[x]) ? 1 : -1;
                }
            }
        }
        return aa.length - bb.length;
    }

    static chunkify(t) {
        let tz = [];
        let x = 0, y = -1, n = false, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            let m = (i === 46 || (i >= 48 && i <= 57));
            if (m !== n) {
                tz[++y] = "";
                n = m;
            }
            tz[y] += j;
        }
        return tz;
    }
}