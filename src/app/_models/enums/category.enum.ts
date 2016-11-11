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
    TIS
}
export const CategoryName = {
    [CategoryType.BN]: "Бантики",
    [CategoryType.BAB]: "Бабочки",
    [CategoryType.B]: "Бордюры",
    [CategoryType.VET]: "Веточки",
    [CategoryType.DET]: "Детское",
    [CategoryType.D]: "Город и быт",
    [CategoryType.J]: "Женское",
    [CategoryType.JI]: "Животные",
    [CategoryType.Z]: "Завитки",
    [CategoryType.L]: "Листики",
    [CategoryType.LE]: "Лэйблы",
    [CategoryType.M]: "Мужское",
    [CategoryType.NG]: "Новый год",
    [CategoryType.NF]: "Наборы фигур и рамок",
    [CategoryType.PM]: "Рамки",
    [CategoryType.SL]: "Слова",
    [CategoryType.SV]: "Свадьба",
    [CategoryType.SC]: "Сердечки",
    [CategoryType.CF]: "Салфетки",
    [CategoryType.UG]: "Уголки",
    [CategoryType.F]: "Фигуры",
    [CategoryType.CV]: "Цветы",
    [CategoryType.OTHER]: "Другое",
    [CategoryType.TIS]: "Тиснение",
}
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
    [CategoryType.CV]: ["Цв"],
    [CategoryType.OTHER]: ["ДР"],
    [CategoryType.TIS]: ["Тис"],
}

export const CategoryList = Object.keys(CategoryName)
    .map(k => new Object({
        key: parseInt(k, 10),
        name: CategoryName[k],
        codes: CategoryArticleCode[k].map(s => s.toUpperCase())
    }));

export class Category {

    static getNames() {
        return Object.keys(CategoryType).filter(v => isNaN(parseInt(v, 10)));
    }

    static getValues() {
        return Object.keys(CategoryType).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    static getNamesAndValues() {
        return Category.getValues().map(v => {
            return {name: CategoryType[v] as string, value: v};
        });
    }
}
