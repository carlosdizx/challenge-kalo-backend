export enum TypesUser{
    ADMIN ,
    USER ,
}

export const parseTypeUser = (type: number) => {
    switch (type){
        case TypesUser.ADMIN:
            return TypesUser.ADMIN;
        default:
            return TypesUser.USER;
    }
}
