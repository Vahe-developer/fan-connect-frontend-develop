import React, {useEffect} from 'react'
import {withRouter}       from 'react-router-dom'
import {renderRoutes}     from 'react-router-config'
import {useDispatch}      from '@myfan/store'
import {Products}         from '@myfan/pages'
import {Routes}           from '@myfan/commons'
import {actions}          from 'Redux'

// @ts-ignore
const ProductsView = ({route}) => {

    const dispatch = useDispatch()

    useEffect(() => {
        actions.profile.getProfileData({dispatch})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {renderRoutes(route.routes, {routePrefix: Routes.product.build()})}
        </>
    )
}

export default withRouter(
    Products.withProducts(ProductsView),
)
