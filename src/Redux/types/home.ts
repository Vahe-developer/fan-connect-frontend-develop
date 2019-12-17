import {Types} from '@myfan/pages'

type Profile = Types.Profile.ProfileT
type Channels = Types.Channels.ChannelT
type Membership = Types.Membership.MembershipT

export type HomeDataT = {
    profile: { getData(): Promise<Profile> },
    channels: { getData(): Promise<Channels> },
    membership: { getData(): Promise<Membership> },
    dispatch(data: any): void,
}
