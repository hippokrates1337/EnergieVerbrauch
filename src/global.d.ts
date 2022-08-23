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
    user: string,
    createdAt: Date,
    updatedAt: Date
}

type Observation = {
    uid: string,
    user: string,
    date: Date,
    type: string,
    value: number,
    unit: string,
    createdAt: Date,
    updatedAt: Date
}