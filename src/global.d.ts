type User = {
    uid: string,
    name: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date,
    userAuthToken: string
}

type ObservationUnit = {
    uid: string,
    name: string,
    user: string
}