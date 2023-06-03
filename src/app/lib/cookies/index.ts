import { IAttributes, IConverter, ICookiesJar } from "./types"

const DEFAULT_ATTRIBUTES = {
    path: "/",
} as IAttributes

const DEFAULT_CONVERTER: IConverter = {
    read: function (value: string) {
        if (value[0] === '"') {
            value = value.slice(1, -1)
        }
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value: string) {
        return encodeURIComponent(value).replace(
            /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
            decodeURIComponent,
        )
    },
}

const main = (converter: IConverter, defaultAttributes: IAttributes) => {
    function assign(
        map: { [x: string]: any },
        defaultAttributes: IAttributes,
        attributes: IAttributes,
    ) {
        const args = [defaultAttributes, attributes]

        for (var i = 1; i < 2; i++) {
            var source = args[i]
            if (!source) continue
            for (var key in source) {
                map[key] = source[key as keyof IAttributes]
            }
        }
        return map as IAttributes
    }

    function get(name: string) {
        if (typeof document === "undefined" || !name) {
            return
        }

        var cookies = document.cookie ? document.cookie.split("; ") : []

        var jar = {} as ICookiesJar

        for (var i = 0; i < cookies.length; i++) {
            var parts = cookies[i].split("=")
            var value = parts.slice(1).join("=")

            try {
                var key = decodeURIComponent(parts[0])

                jar[key] = converter.read(value)

                if (name === key) {
                    break
                }
            } catch (e: any) {
                console.error(e.message || e)
            }
        }

        return jar[name]
    }

    function set(
        name: string,
        value: string,
        attributes: IAttributes = {} as IAttributes,
    ) {
        if (typeof document === "undefined") {
            return
        }

        attributes = assign({}, defaultAttributes, attributes)

        if (typeof attributes.expires === "number") {
            attributes.expires = new Date(
                Date.now() + attributes.expires * 864e5,
            ).toUTCString()
        }

        name = encodeURIComponent(name)
            .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
            .replace(/[()]/g, escape)

        var stringifiedAttributes = ""

        for (var attributeName in attributes) {
            if (!attributes[attributeName as keyof IAttributes]) {
                continue
            }

            stringifiedAttributes += "; " + attributeName

            if (attributes[attributeName as keyof IAttributes] === true) {
                continue
            }

            const value = attributes[
                attributeName as keyof IAttributes
            ] as string
            stringifiedAttributes += "=" + String(value).split(";")[0]
        }

        document.cookie =
            name + "=" + converter.write(value) + stringifiedAttributes

        return get(name)
    }

    function remove(name: string, attributes: IAttributes) {
        const value = get(name)
        set(name, "", assign({}, attributes, { expires: "-1" }))
        return value
    }

    const beta = {
        withAttributes: function (attributes: IAttributes) {
            return main(converter, assign({}, defaultAttributes, attributes))
        },
        // withConverter: function (newConverter:IConverter) {
        //     return main(assign({}, converter, newConverter), defaultAttributes)
        // },
    }

    return { get, set, remove, ...beta }
}

const Cookies = main(DEFAULT_CONVERTER, DEFAULT_ATTRIBUTES)

export default Cookies
