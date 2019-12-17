const defaultConfig = {
    name:                            "",
    logoUrl:                         "",
    favicon:                         "",
    fontColor:                       "",
    buttonBg:                        "",
    buttonColor:                     "",
    navbarBg:                        "",
    prefTitleColor:                  "",
    featureLoginRegistrationEnabled: true,
    backendUrl:                      "",
    club:                            "",
    profileSectionsGridArea:         "",
    termOfUseLink:                   "",
    featurePolls:                    true,
    featureFavoritePlayer:           true,
    featureProfileEnabled:           true,
    featureBackToHeaderEnabled:      true,
    featureFooterEnabled:            true,
    featureHeaderTabs:               true,
    featureEnableBetaText:           true,
    featurePaypal:                   false,
    featureHubspot:                  false,
    featureChannels:                 [],
}

const Club = {
    config:     defaultConfig,
    get logo() {
        return this.config.logoUrl
    },
    get fontColor() {
        return this.config.fontColor
    },
    get btnBg() {
        return this.config.buttonBg
    },
    get btnC() {
        return this.config.buttonColor
    },
    get navbarBg() {
        return this.config.navbarBg
    },
    get name() {
        return this.config.club
    },
    get title() {
        return this.config.name
    },
    get prefTitleC() {
        return this.config.prefTitleColor
    },
    get channels() {
        return this.config.featureChannels
    },
    get backendUrl() {
        return this.config.backendUrl
    },
    get termOfUseLink() {
        return this.config.termOfUseLink
    },
    get isEnabledFooter() {
        return this.config.featureFooterEnabled
    },
    get isEnabledLoginRegister() {
        return this.config.featureLoginRegistrationEnabled
    },
    get isEnabledProfile() {
        return this.config.featureProfileEnabled
    },
    get isEnabledBackToHeader() {
        return this.config.featureBackToHeaderEnabled
    },
    get isEnabledNavTabs() {
        return this.config.featureHeaderTabs
    },
    get activeChannels() {
        return this.config.featureChannels
    },
    get isEnabledBetaText() {
        return this.config.featureEnableBetaText
    },
    get isEnabledPaypal() {
        return this.config.featurePaypal
    },
    get isEnabledPolls() {
        return this.config.featurePolls
    },
    get isEnabledFavoritePlayer() {
        return this.config.featureFavoritePlayer
    },
    get profileSectionsGridArea() {
        return this.config.profileSectionsGridArea
    },
    get isEnabledHubspot() {
        return this.config.featureHubspot
    },
    parse:      function (config) {
        return {}
    },
    setConfigs: function (config) {
        this.config = this.parse(config)
    }

}

module.exports = Club
