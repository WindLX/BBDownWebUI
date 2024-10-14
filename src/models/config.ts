import toml from 'toml'

export interface Config {
    backend: {
        url: string
    }
}

export const defaultConfig: Config = {
    backend: {
        url: 'http://localhost:12345'
    }
}

export const loadConfig = async (): Promise<Config> => {
    try {
        const response = await fetch('/config.toml')
        const configText = await response.text()
        const config = toml.parse(configText)

        if (!config.backend) {
            throw new Error('Config file is missing backend configuration')
        }

        if (!config.backend.url) {
            throw new Error('Config file is missing backend url')
        }

        return config as Config
    } catch (error) {
        throw new Error('Failed to load config file: ' + error)
    }
}