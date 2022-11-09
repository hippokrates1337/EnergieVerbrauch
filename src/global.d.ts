type User = {
    uid: string,
    name: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date,
    userAuthToken: string
}

type Consumer = {
    uid: string,
    name: string,
    user: string,
    createdAt: Date,
    updatedAt: Date
}

type Reading = {
    uid: string,
    user: string,
    consumer: string,
    date: Date,
    type: string,
    value: number,
    createdAt: Date,
    updatedAt: Date
}

type ChartData = {
    startDate: Date,
    endDate: Date,
    data: {
        consumer: string,
        values: number[]
    }[]
}