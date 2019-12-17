export type IClub = {
    userEmail: string,
    channels: IChannel[],
    loading: boolean,
    prevState: IChannel[],
    subsFound: boolean
}

export type IFrequency = {
    id: number,
    name: string,
    selected: boolean,
    nameTranslationKey: string
}

export type ITopic = {
    id: number,
    name: string,
    nameTranslationKey: string,
    description: string,
    descTranslationKey: string,
    selected: boolean
}

export type IChannel = {
    id: number,
    icon: string,
    name: string,
    selected: boolean,
    disabled: boolean,
    topics: ITopic[],
    frequencies: IFrequency[]
}
