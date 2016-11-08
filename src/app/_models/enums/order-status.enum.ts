export type OrderStatus
    = "CART"
    | "ORDER_CONFIRMED"
    | "ORDER_PAYED"
    | "ORDER_PAYMENT_RECIEVED"
    | "ORDER_SENT"
    | "ORDER_RECEIVED"
    | "ORDER_CANCELLED"
    | "ORDER_ARCHIVE"

export class OrderStatuses {
    public static get CART(): OrderStatus {
        return "CART";
    }

    public static get NEW(): OrderStatus {
        return "ORDER_CONFIRMED";
    }

    public static get PAYED(): OrderStatus {
        return "ORDER_PAYED";
    }

    public static get PAYMENT_RECIEVED(): OrderStatus {
        return "ORDER_PAYMENT_RECIEVED";
    }

    public static get SENT(): OrderStatus {
        return "ORDER_SENT";
    }

    public static get RECEIVED(): OrderStatus {
        return "ORDER_RECEIVED";
    }

    public static get CANCELLED(): OrderStatus {
        return "ORDER_CANCELLED";
    }

    public static get ARCHIVE(): OrderStatus {
        return "ORDER_ARCHIVE";
    }

    public static get asList(): OrderStatus[] {
        return [
            OrderStatuses.CART,
            OrderStatuses.NEW,
            OrderStatuses.PAYED,
            OrderStatuses.PAYMENT_RECIEVED,
            OrderStatuses.SENT,
            OrderStatuses.RECEIVED,
            OrderStatuses.CANCELLED,
            OrderStatuses.ARCHIVE,
        ];
    }
}

export class OrderStatusName {
    public static getName(s: OrderStatus): string {
        switch (s) {
            case OrderStatuses.CART:
                return "Cart";
            case OrderStatuses.NEW:
                return "Новый";
            case OrderStatuses.PAYED:
                return "Оплачен";
            case OrderStatuses.PAYMENT_RECIEVED:
                return "Оплата получена";
            case OrderStatuses.SENT:
                return "Отправлен";
            case OrderStatuses.RECEIVED:
                return "Получен";
            case OrderStatuses.CANCELLED:
                return "Отменен";
            case OrderStatuses.ARCHIVE:
                return "Архив";
            default:
                return "unknown";
        }
    }

    public static getActionName(s: OrderStatus): string {
        switch (s) {
            case OrderStatuses.CART:
                return "Cart";
            case OrderStatuses.NEW:
                return "Новый";
            case OrderStatuses.PAYED:
                return "Заказ Оплачен";
            case OrderStatuses.PAYMENT_RECIEVED:
                return "Подтвердить оплату";
            case OrderStatuses.SENT:
                return "Отправка";
            case OrderStatuses.RECEIVED:
                return "Заказ пришёл!";
            case OrderStatuses.CANCELLED:
                return "Отменить";
            case OrderStatuses.ARCHIVE:
                return "Архивировать";
            default:
                return "unknown";
        }
    }
}
