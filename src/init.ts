import 'url-polyfill'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import {Club}           from '@myfan/base'
import {NetworkFactory} from '@myfan/commons'
import config           from '../src/configs/config.json'
import mobile           from '../src/configs/mobile.json'
// @ts-ignore
import smoothscroll     from 'smoothscroll-polyfill'

smoothscroll.polyfill()

// @ts-ignore
Club.setConfigs(config)
Club.setMobileConfigs(mobile)
NetworkFactory.setDefaultBaseUrl(Club.backendUrl)
