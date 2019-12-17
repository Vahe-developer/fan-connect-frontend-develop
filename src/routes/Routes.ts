import {Club}              from '@myfan/base'
import {retry, Routes}     from '@myfan/commons'
import {ElementType, lazy} from 'react'
import Payment             from '../components/payment/Payment'

const lazyAuth                    = import('../components/authv2/Auth')
const lazyLogin                   = import('../components/auth/login/Login')
const lazyRegister                = import('../components/auth/register/Register')
const lazyClient                  = import('../components/clients/Client')
const lazyNotFound                = import('../components/errors/error-pages/NotFound')
const lazyEmailConfirmation       = import('../components/preferences/linking/nl2go/EmailComfirmation')
const lazyImpressum               = import('../components/impressum/Impressum')
const lazyDataPermission          = import('../components/DataPermission/DataPermission')
const lazyEmptyComponent          = import('../components/empty-component/EmptyComponent')
const lazyForgotPassword          = import('../components/auth/forgot-password/ForgotPassword')
const lazySetPassword             = import('../components/auth/forgot-password/SetPassword')
const lazyConfirmEmail            = import('../components/open-id/ConfirmEmail')
const lazyPrivacy                 = import('../components/privacy/Privacy')
const lazyFcspLayout              = import('../components/layout/Layout')
const LazyPreferences             = import('../components/preferences/Preferences')
const LazyProfileRedirector       = import('../components/profile/ProfileRedirector')
const LazyNews                    = import('../components/news/News')
const LazyMaps                    = import('../components/maps/Maps')
const LazyProducts                = import('../components/products/Products')
const LazyProductMembership       = import('../components/products/membership/Membership')
const LazyRegisterMembership      = import('../components/products/membership/RegisterMembership')
const LazyMembershipIntroduction  = import('../components/products/membership/Introduction')
const LazyMembershipRegisterSteps = import('../components/products/membership/RegisterSteps')
const LazyMembershipSuccess       = import('../components/products/membership/SuccessView')
const LazyMembershipEdit          = import('../components/products/membership/MembershipEdit')
const LazyHome                    = import('../components/home/Home')
const LazyFcspConnect             = import('../components/fcsp-connect/FcspConnect')

const Auth: ElementType                    = lazy(() => retry(() => lazyAuth))
const Client: ElementType                  = lazy(() => retry(() => lazyClient))
const NotFound: ElementType                = lazy(() => retry(() => lazyNotFound))
const EmailConfirmation: ElementType       = lazy(() => retry(() => lazyEmailConfirmation))
const Impressum: ElementType               = lazy(() => retry(() => lazyImpressum))
const DataPermission: ElementType          = lazy(() => retry(() => lazyDataPermission))
const EmptyComponent: ElementType          = lazy(() => retry(() => lazyEmptyComponent))
const ForgotPassword: ElementType          = lazy(() => retry(() => lazyForgotPassword))
const SetPassword: ElementType             = lazy(() => retry(() => lazySetPassword))
const ConfirmEmail: ElementType            = lazy(() => retry(() => lazyConfirmEmail))
const Privacy: ElementType                 = lazy(() => retry(() => lazyPrivacy))
const FcspLayout: ElementType              = lazy(() => retry(() => lazyFcspLayout))
const Register: ElementType                = lazy(() => retry(() => lazyRegister))
const Preferences: ElementType             = lazy(() => retry(() => LazyPreferences))
const Login: ElementType                   = lazy(() => retry(() => lazyLogin))
const ProfileRedirector: ElementType       = lazy(() => retry(() => LazyProfileRedirector))
const News: ElementType                    = lazy(() => retry(() => LazyNews))
const Maps: ElementType                    = lazy(() => retry(() => LazyMaps))
const Products: ElementType                = lazy(() => retry(() => LazyProducts))
const Membership: ElementType              = lazy(() => retry(() => LazyProductMembership))
const RegisterMembership: ElementType      = lazy(() => retry(() => LazyRegisterMembership))
const MembershipIntroduction: ElementType  = lazy(() => retry(() => LazyMembershipIntroduction))
const MembershipRegisterSteps: ElementType = lazy(() => retry(() => LazyMembershipRegisterSteps))
const MembershipSuccess: ElementType       = lazy(() => retry(() => LazyMembershipSuccess))
const MembershipEdit: ElementType          = lazy(() => retry(() => LazyMembershipEdit))
const Home: ElementType                    = lazy(() => retry(() => LazyHome))
const FcspConnect: ElementType             = lazy(() => retry(() => LazyFcspConnect))

export const publicRoutes = [
    {
        path     : Routes.auth.v1.authorize.build(),
        component: Client,
        exact    : true,
    },
    {
        path     : Routes.confirmEmail.activationCode.hash.build(),
        component: ConfirmEmail,
        exact    : true,
    },
    {
        path     : Routes.confirmAccountMerge.build(),
        component: EmailConfirmation,
        exact    : true,
    },
]

const publicRoutesWithHeader = [
    {
        path     : Routes.maps.build(),
        exact    : true,
        component: Maps,
    },
    {
        path     : Routes.news.build(),
        component: News,
        exact    : true,
    },
    {
        path     : Routes.product.build(),
        component: Products,
        routes   : [
            {
                path     : Routes.product.membership.build(),
                component: Membership,
                routes   : [
                    {
                        path     : Routes.product.membership.introduction.build(),
                        component: MembershipIntroduction,
                        exact    : true,
                    },
                    {
                        path     : Routes.product.membership.registerSteps.build(),
                        component: MembershipRegisterSteps,
                        exact    : true,
                    },
                    {
                        path     : Routes.product.membership.registerMembership.build(),
                        component: RegisterMembership,
                        exact    : true,
                    },
                    {
                        path     : Routes.product.membership.success.build(),
                        component: MembershipSuccess,
                        exact    : true,
                    },
                    {
                        path     : Routes.product.membership.edit.build(),
                        component: MembershipEdit,
                        exact    : true,
                    },
                ],
            },
            {
                component: NotFound,
            },
        ],
    },
]

export const routes = [
    ...publicRoutes,
    {
        path     : Routes.root.build(),
        component: FcspLayout,
        routes   : [
            ...publicRoutesWithHeader,
            {
                path     : Routes.authorization.build(),
                component: Auth,
                routes   : [
                    {
                        path     : Routes.authorization.login.hash.optional.build(),
                        exact    : true,
                        component: Club.isEnabledLoginRegister ? Login : EmptyComponent,
                    },
                    {
                        path     : Routes.authorization.register.params.optional.build(),
                        exact    : true,
                        component: Club.isEnabledLoginRegister ? Register : EmptyComponent,
                    },
                ],
            },
            {
                path     : Routes.preference.hash.optional.build(),
                exact    : true,
                component: Preferences,
            },
            {
                path     : Routes.forgotPassword.build(),
                exact    : true,
                component: ForgotPassword,
            },
            {
                path     : Routes.setPassword.confirmationCode.hash.build(),
                exact    : true,
                component: SetPassword,
            },
            {
                path     : Routes.impressum.build(),
                exact    : true,
                component: Impressum,
            },
            {
                path     : Routes.privacy.build(),
                exact    : true,
                component: Privacy,
            },
            {
                component: NotFound,
            },
        ],
    },
]

export const protectedRoutes = [
    ...publicRoutes,
    {
        path     : Routes.root.build(),
        component: FcspLayout,
        routes   : [
            ...publicRoutesWithHeader,
            {
                path     : Routes.home.build(),
                exact    : true,
                component: Home,
            },
            {
                path     : Routes.paymentApproved.build(),
                exact    : true,
                component: Payment,
            },
            {
                path     : Routes.dataPermission.build(),
                component: DataPermission,
                exact    : true,
            },
            {
                path     : Routes.preference.hash.optional.build(),
                exact    : true,
                component: Preferences,
            },
            {
                path     : Routes.profile.build(),
                exact    : true,
                component: Club.isEnabledProfile ? ProfileRedirector : EmptyComponent,
            },
            {
                path     : Routes.profile.hash.optional.build(),
                component: Club.isEnabledProfile ? ProfileRedirector : EmptyComponent,
                exact    : true,
            },
            {
                path     : Routes.fcspConnect.build(),
                component: FcspConnect,
                exact    : true,
            },
            {
                path     : Routes.impressum.build(),
                exact    : true,
                component: Impressum,
            },
            {
                path     : Routes.privacy.build(),
                exact    : true,
                component: Privacy,
            },
            {
                component: NotFound,
            },
        ],
    },
]
