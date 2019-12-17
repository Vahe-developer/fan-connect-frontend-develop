import './init'
import React                        from 'react'
import ReactDOM                     from 'react-dom'
import App                          from './app'
import {CookiesProvider}            from 'react-cookie'
// @ts-ignore
import IntlPolyfill                 from 'react-intl-polyfill'
import {GlobalStore}                from '@myfan/store'
import {rootReducers, initialState} from 'Redux'
import {ViewModelProvider}          from '@myfan/pages'
import {Intl}                       from '@myfan/commons'
import de                           from './translations/de.json'
import en                           from './translations/en.json'
import BrouserRouterWrapper         from './components/router/BrouserRouterWrapper'

const root = document.getElementById('root')
if (root == null) {
    throw new Error('root element not found')
}

ReactDOM.render(
    <IntlPolyfill locales={['en', 'de']}>
        <Intl.Provider de={de} en={en}>
            <BrouserRouterWrapper>
                <CookiesProvider>
                    <ViewModelProvider>
                        <GlobalStore reducers={rootReducers} initialState={initialState}>
                            <App/>
                        </GlobalStore>
                    </ViewModelProvider>
                </CookiesProvider>
            </BrouserRouterWrapper>
        </Intl.Provider>
    </IntlPolyfill>,
    (root as HTMLElement),
)
