import {Home as HomePage}                     from '@myfan/pages'
import React, {useEffect, useState}           from 'react'
import {Club}                                 from '@myfan/base'
import {Global, Types}                        from '@myfan/commons'
import {
    withContext,
    withStore,
    useDispatch,
}                                             from '@myfan/store'
import {actions, GlobalState, GlobalContextT} from 'Redux'
import {
    Container,
    styled,
    Wrapper,
    WrapperContainer,
    Pages,
    MaterialButton,
    MaterialSelect,
    TextContainerWithColumns,
}                                             from '@myfan/web-components'

type FcspConnectT = {
    intl: Types.IntlShape,
    home: HomePage.HomeT,
    errors: {}
}

const {AppContainer, ImageContainer, Connection} = Pages.HomePage.Containers

const Header = styled.div`
    text-align : center;
    text-transform : uppercase;
`

const DescriptionContainer = styled.div`
        padding : 8px;
`

const ImageContainerWrapper = styled(ImageContainer)`
    
    position: relative;

    .connection {
        position: absolute;
        right: 1px;
        bottom: 1px;
        width: fit-content;
        background: white;
        padding: 4px 16px;
    }
`

const FcspConnect = ({home, intl: {formatMessage, formatHTMLMessage}, errors}: FcspConnectT) => {

    const dispatch = useDispatch()

    const [categoryNameKey, setCategoryNameKey] = useState('')

    useEffect(() => {
        if (!home.loading) {
            return
        }
        actions.home.getHomeData({dispatch})

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [home.apps])

    const convertAppsCategoriesSelectable = (categories: HomePage.AppCategory[]) => {

        return categories.map((category) => {
            return {
                value: category.nameKey,
                label: formatMessage({id: category.nameKey}),
            }
        })
    }

    const getAppCategoryId = () => {
        const cat = home.appsCategories.find(cat => cat.nameKey === categoryNameKey)

        if (cat) {
            return cat.id
        }

        return undefined
    }

    return (
        <Container>
            <Header
                className={'title bold'}
                // @ts-ignore
                dangerouslySetInnerHTML={{
                    __html: formatHTMLMessage({id: 'fcsp.connect'}),
                }}/>
            {!!home.apps.length && (
                <>
                    <div style={{
                        minWidth: 170,
                        width   : 0,
                        margin  : '24px auto',
                    }}>
                        <MaterialSelect
                            value={categoryNameKey}
                            label={formatMessage({id: 'categories'})}
                            inputProps={{
                                name: 'appCategory',
                            }}
                            items={convertAppsCategoriesSelectable(home.appsCategories)}
                            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setCategoryNameKey(event.target.value)
                            }}
                            errors={errors}
                        />
                    </div>
                    <WrapperContainer>
                        <Wrapper>
                            {home.apps
                                .filter(app => !categoryNameKey || categoryNameKey === 'all.categories' || app.categoryId === getAppCategoryId())
                                .map((app, key) => (
                                    <AppContainer style={{width: 264, marginBottom: 24}} key={key}
                                                  className={'apps-container'}>
                                        <ImageContainerWrapper>
                                            <ImageContainer
                                                connected={!app.permissionSet}
                                                src={`${Club.backendUrl.replace('/api', '')}/media/setting/Gary-Moore.png`}
                                            >
                                                <Connection>
                                                    {!app.permissionSet && (
                                                        <MaterialButton
                                                            variant={'contained'}
                                                            onClick={() => {
                                                                Global.window.open(app.loginUri, '_blank')
                                                            }}
                                                        >
                                                            Verbiden
                                                        </MaterialButton>
                                                    )}
                                                </Connection>
                                            </ImageContainer>
                                            {app.permissionSet && (
                                                <div className={'connection text'}>
                                                    {formatMessage({id: 'apps.connected'})}
                                                </div>
                                            )}
                                        </ImageContainerWrapper>
                                        <DescriptionContainer>
                                            <TextContainerWithColumns>
                                                <div className={'title'}>
                                                    {app.name}
                                                </div>
                                                <div className={'text'}>
                                                    {formatMessage({id: app.desc})}
                                                </div>
                                            </TextContainerWithColumns>
                                        </DescriptionContainer>
                                        <div style={{
                                            textAlign   : 'right',
                                            paddingRight: 8,
                                        }}>
                                            {app.permissionSet && (
                                                <div className={'connection text color-red pointer'}>
                                                    {formatMessage({id: 'apps.disconnect'}).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </AppContainer>
                                ))}
                        </Wrapper>
                    </WrapperContainer>
                </>
            )}
        </Container>
    )
}

export default withStore(
    withContext(
        FcspConnect,
        (ctx: GlobalContextT) => ({intl: ctx.intl})),
    (state: GlobalState) => ({home: state.home, errors: state.errors}))
