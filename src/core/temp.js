export const options = {
    notation: 'mixed_sc',
}

export function getTempData() {
    let s = {
        upg: {},

        upgrade_effects: {},
        auto_upgs_unlocked: {},

        currency_gain: {},

        rank_effects: [],

        bh_effect: [DC.D1, DC.D1, DC.D1],
        abh_effect: [DC.D1, DC.D1, DC.D1],

        mlt_effect: [DC.D1],

        achievement_effects: {},
    }
    for (let i = 0; i < RANKS_LEN; i++) {
        s.rank_effects[i] = {}
    }
    return s
}

window.temp = {};

export const TempUpdate = {};

window.createTempUpdate = (name, method) => { TempUpdate[name] = method }

export function updateTemp() {
    TempUpdate['updateRanksTemp']()
    TempUpdate['updateUpgradesTemp']()

    TempUpdate['updateAchievementsTemp']()

    TempUpdate['updateMultiverseTemp']()
    TempUpdate['updateBHTemp']()

    TempUpdate['updateCurrenciesTemp']()

    options.notation = ['sc','st','mixed_sc'][player.options.notation]
}