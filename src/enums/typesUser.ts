export enum TypesUser{
    ADMIN ,
    USER ,
}

export const parseTypeUser = (type: number) => {
    switch (type){
        case TypesUser.ADMIN:
            return TypesUser.ADMIN;
        case TypesUser.USER:
            return TypesUser.USER;
        default:
            return null;
    }
}
