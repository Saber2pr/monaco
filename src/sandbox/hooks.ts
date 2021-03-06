/*
 * @Author: saber2pr
 * @Date: 2020-04-30 14:32:56
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-03 15:23:32
 */
import { KEYS } from '../constants'

export const ConsoleHook = `<script data-type="${KEYS.__SANDBOX_HOOK__}">
;(() => {
	// hook
	var origin_log = console.log
	console.log = function() {
		origin_log.apply(this, arguments)
		var output = Array.from(arguments).join(" ")
		top.postMessage({method: "${KEYS.__MESSAGE_CONSOLE__}", value: output}, top.location.origin)
	}
	window.addEventListener('error', event => {
		top.postMessage({method: "${KEYS.__MESSAGE_CONSOLE_ERROR__}", value: event.message}, top.location.origin)
	})
})()</script>`
