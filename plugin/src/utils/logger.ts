import debug from 'debug'

import { PLUGIN_NAME } from './constant'

export type LogLevel = 'info' | 'warn' | 'error' | 'silent'

const LOG_NAMESPACES = {
    debug: `${PLUGIN_NAME}:DEBUG`,
    info: `${PLUGIN_NAME}:INFO`,
    warn: `${PLUGIN_NAME}:WARN`,
    error: `${PLUGIN_NAME}:ERROR`
} as const

const NAMESPACE_COLORS: Record<string, number> = {
    [LOG_NAMESPACES.debug]: 33,
    [LOG_NAMESPACES.info]: 46,
    [LOG_NAMESPACES.warn]: 214,
    [LOG_NAMESPACES.error]: 196
}

const defaultSelectColor = debug.selectColor.bind(debug)
debug.selectColor = (namespace: string) => {
    return NAMESPACE_COLORS[namespace] ?? defaultSelectColor(namespace)
}

const LEVEL_TO_NAMESPACES: Record<LogLevel, string[]> = {
    info: [LOG_NAMESPACES.info, LOG_NAMESPACES.warn, LOG_NAMESPACES.error],
    warn: [LOG_NAMESPACES.warn, LOG_NAMESPACES.error],
    error: [LOG_NAMESPACES.error],
    silent: []
}

const isLogLevel = (level: unknown): level is LogLevel => {
    return level === 'info' || level === 'warn' || level === 'error' || level === 'silent'
}

export const setLogLevel = (level?: LogLevel) => {
    if (!isLogLevel(level)) {
        return
    }

    debug.enable(LEVEL_TO_NAMESPACES[level].join(','))
}

export const debug_log = debug(LOG_NAMESPACES.debug)

export const info_log = debug(LOG_NAMESPACES.info)
info_log.log = console.info.bind(console)


export const warn_log = debug(LOG_NAMESPACES.warn)
warn_log.log = console.warn.bind(console)

export const error_log = debug(LOG_NAMESPACES.error)
error_log.log = console.error.bind(console)


export const prettyLog = (obj?: Record<string, any>) => {
    return JSON.stringify(obj, null, 2)
}
