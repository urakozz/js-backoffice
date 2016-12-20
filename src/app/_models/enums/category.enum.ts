export enum CategoryType {
    BN,
    BAB,
    B,
    VET,
    DET,
    D,
    J,
    JI,
    Z,
    L,
    LE,
    M,
    NG,
    NF,
    PM,
    SL,
    SV,
    SC,
    CF,
    UG,
    F,
    CV,
    OTHER,
    TIS,
    FON
}
export const CategoryName = {
    // [CategoryType.BN]: "Бантики",
    [CategoryType.BAB]: "Бабочки",
    [CategoryType.B]: "Бордюры",
    [CategoryType.VET]: "Веточки",
    [CategoryType.DET]: "Детское",
    [CategoryType.D]: "Город и быт",
    [CategoryType.J]: "Мужское и женское",
    [CategoryType.JI]: "Животные и птицы",
    [CategoryType.Z]: "Завитки",
    [CategoryType.L]: "Листики",
    [CategoryType.LE]: "Лэйблы и надписи",
    [CategoryType.M]: "Звезды",
    [CategoryType.NG]: "Новый год",
    [CategoryType.NF]: "Транспорт",
    [CategoryType.PM]: "Рамки",
    // [CategoryType.SL]: "Надписи",
    [CategoryType.SV]: "Любовь",
    [CategoryType.SC]: "Сердечки",
    [CategoryType.CF]: "Салфетки",
    [CategoryType.UG]: "Уголки",
    [CategoryType.F]: "Фигуры",
    [CategoryType.FON]: "Фоны",
    [CategoryType.CV]: "Цветы",
    [CategoryType.OTHER]: "Другое",
    [CategoryType.TIS]: "Тиснение",
};
export const CategoryArticleCode: {[key: number]: string[]} = {
    [CategoryType.BN]: ["Бн"],
    [CategoryType.BAB]: ["Баб"],
    [CategoryType.B]: ["Б"],
    [CategoryType.VET]: ["Вет", "ВетД", "Лисвет"],
    [CategoryType.DET]: ["Дет"],
    [CategoryType.D]: ["Д"],
    [CategoryType.J]: ["Ж"],
    [CategoryType.JI]: ["Жи"],
    [CategoryType.Z]: ["З"],
    [CategoryType.L]: ["Л", "Лисвет"],
    [CategoryType.LE]: ["Лэ"],
    [CategoryType.M]: ["М"],
    [CategoryType.NG]: ["Нг"],
    [CategoryType.NF]: ["Нф"],
    [CategoryType.PM]: ["Рм"],
    [CategoryType.SL]: ["Сл"],
    [CategoryType.SV]: ["Св"],
    [CategoryType.SC]: ["Сц"],
    [CategoryType.CF]: ["Сф"],
    [CategoryType.UG]: ["Уг"],
    [CategoryType.F]: ["Ф"],
    [CategoryType.FON]: ["Фон"],
    [CategoryType.CV]: ["Цв"],
    [CategoryType.OTHER]: ["ДР"],
    [CategoryType.TIS]: ["Тис"],
};

export interface CategoryDetails {
    key: number;
    name: string;
    codes: string[];
}

export const CategoryList: CategoryDetails[] = Object.keys(CategoryName)
    .map(k => {
        return {
            key: parseInt(k, 10),
            name: CategoryName[k],
            codes: CategoryArticleCode[k].map(s => s.toUpperCase())
        }
    });


// export class Category {
//
//     static getNames() {
//         return Object.keys(CategoryType).filter(v => isNaN(parseInt(v, 10)));
//     }
//
//     static getValues() {
//         return Object.keys(CategoryType).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
//     }
//
//     static getNamesAndValues() {
//         return Category.getValues().map(v => {
//             return {name: CategoryType[v] as string, value: v};
//         });
//     }
// }
