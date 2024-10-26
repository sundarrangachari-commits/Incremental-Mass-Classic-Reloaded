export const options = {
    notation: 'mixed_sc',
}

export function getTempData() {
    let s = {
        upg: {},

        bonus_upgrades: {},
        upgrade_effects: {},
        auto_upgs_unlocked: {},
        locked_upgrades: {},

        currency_gain: {},

        ranks_fp: 1,
        rank_effects: [],

        bh_effect: [DC.D1, DC.D1, DC.D1],
        abh_effect: [DC.D1, DC.D1, DC.D1],

        mlt_effect: [DC.D1],

        achievement_effects: {},

        trapped_chal: {},
        outside_chal: true,
        chal_effect: {},
    }
    for (let i = 0; i < RANKS_LEN; i++) {
        s.rank_effects[i] = {}
    }
    for (let id in CHALLENGES) {
        s.trapped_chal[id] = false
    }
    return s
}

window.temp = {};

export const TempUpdate = {};

window.createTempUpdate = (name, method) => { TempUpdate[name] = method }

export function updateTemp() {
    temp.outside_chal = true
    for (let id in CHALLENGES) {
        temp.trapped_chal[id] = false

        const C = CHALLENGES[id]

        if (player.chal.active[id]) {
            temp.outside_chal = false
            if ('trap' in C) for (let t of C.trap) temp.trapped_chal[t] = true;
        }
    }

    TempUpdate['updateRanksTemp']()
    TempUpdate['updateUpgradesTemp']()

    TempUpdate['updateAchievementsTemp']()

    TempUpdate['updateChallengesTemp']()

    TempUpdate['updateMultiverseTemp']()
    TempUpdate['updateBHTemp']()

    TempUpdate['updateCurrenciesTemp']()

    options.notation = ['sc','st','mixed_sc'][player.options.notation]
}