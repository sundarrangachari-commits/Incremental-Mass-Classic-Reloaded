import { hasUpgrade, simpleUpgradeEffect } from "./upgrades"

export const BH_UPGRADES = {
    'bh1': {
        unl: ()=>player.bh.unlocked,
        get description() { return `Increase mass of black hole by <b>${formatMult(this.base)}</b> per level.` },

        curr: "dark-matter",
        cost: a => a.sumBase(1.01).pow_base(2).div(simpleUpgradeBoost('mlt6',simpleAchievementEffect(24))),
        bulk: a => a.mul(simpleUpgradeBoost('mlt6',simpleAchievementEffect(24))).log(2).sumBase(1.01,true).floor().add(1),

        get bonus() { return upgradeEffect('mlt2',0) },
        get strength() { return Decimal.mul(simpleUpgradeEffect('mlt7'),challengeEffect('2-2')) },
        get base() {
            let b = Decimal.mul(3,simpleUpgradeEffect('bh4')).mul(simpleUpgradeEffect('bh14'))
            return b
        },
        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    'bh2': {
        unl: ()=>player.bh.unlocked,
        get description() { return `Increase the exponent of the second effect of black hole by <b>+${formatPercent(this.base)}</b> per level.` },

        curr: "dark-matter",
        cost: a => a.sumBase(1.05).pow_base(10).div(simpleUpgradeBoost('mlt6',simpleAchievementEffect(24))),
        bulk: a => a.mul(simpleUpgradeBoost('mlt6',simpleAchievementEffect(24))).log(10).sumBase(1.05,true).floor().add(1),

        get bonus() { return upgradeEffect('mlt2',0) },
        get base() {
            let b = Decimal.add(0.5,simpleUpgradeEffect('bh9',0))
            return b
        },
        effect(a) {
            let x = this.base.mul(a).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },
    'bh3': {
        qol: true,
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `Start with the first three mass upgrades unlocked. Unlock the fourth mass upgrade that cheapens the previous mass upgrades.` },

        curr: "dark-matter",
        cost: a => 5,
    },
    'bh4': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `The normal mass increases the base of <b>bh1</b> upgrade at a reduced rate.` },

        curr: "dark-matter",
        cost: a => 100,

        effect(a) {
            let x = hasUpgrade('bh14') ? expPow(player.mass.add(10).log10(),0.5).pow(2) : player.mass.add(10).log10().log10().add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    'bh5': {
        qol: true,
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `Automate rage upgrades without spending any resources.` },

        curr: "dark-matter",
        cost: a => 1e3,
    },
    'bh6': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `Add a new effect of the black hole. Improve the first black hole's effect.` },

        curr: "dark-matter",
        cost: a => 1e4,
    },
    'bh7': {
        qol: true,
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `Passively generate 100% of your rage powers gained on reset.` },

        curr: "dark-matter",
        cost: a => 1e5,
    },
    'bh8': {
        qol: true,
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `Unlock the <b>Anti-Black Hole</b>. The <b>bh2</b> upgrade affects the third effect of the black hole and the second effect of the anti-black hole at a reduced rate.` },

        curr: "dark-matter",
        cost: a => 1e6,

        effect(a) {
            let x = upgradeEffect('bh2').max(1).root(2)
            return x
        },
        effDesc: x => formatPow(x),
    },
    'bh9': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `The mass of anti-black hole increases the base of <b>bh2</b> upgrade at a reduced rate.` },

        curr: "dark-matter",
        cost: a => 1e7,

        effect(a) {
            let x = expPow(player.bh.anti_mass.add(1).log10(),0.5).div(10)
            return x
        },
        effDesc: x => "+"+format(x,4),
    },
    'bh10': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `Improve the <b>r3</b> upgrade singificantly.` },

        curr: "dark-matter",
        cost: a => 1e8,
    },
    'bh11': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `Add a new effect of the anti-black hole. The black hole boosts mass of the anti-black hole.` },

        curr: "dark-matter",
        cost: a => 1e9,

        effect(a) {
            let x = expPow(player.bh.mass.add(1),1/3)
            return x
        },
        effDesc: x => formatMult(x),
    },
    'bh12': {
        max: 1,

        unl: ()=>player.mlt.unlocked,
        get description() { return `Rage powers are raised to the <b>1.15th</b> power.` },

        curr: "dark-matter",
        cost: a => 1e13,
    },
    'bh13': {
        max: 1,

        unl: ()=>player.mlt.unlocked,
        get description() { return `The <b>bh1</b> upgrade affects the anti-black hole at a reduced rate.` },

        curr: "dark-matter",
        cost: a => 1e40,

        effect(a) {
            let x = expPow(upgradeEffect('bh1'),1/2)
            return x
        },
        effDesc: x => formatMult(x),
    },
    'bh14': {
        max: 1,

        unl: ()=>player.mlt.unlocked,
        get description() { return `The mass of black hole increases the base of <b>bh1</b> upgrade at a reduced rate. Improve the <b>bh4</b> upgrade.` },

        curr: "dark-matter",
        cost: a => 1e69,

        effect(a) {
            let x = expPow(player.bh.mass.add(10).log10(),0.5).pow(2)
            return x
        },
        effDesc: x => formatMult(x),
    },
    'bh15': {
        max: 1,

        unl: ()=>player.mlt.unlocked,
        get description() { return `Dark matter boosts multiversal energy generation.` },

        curr: "dark-matter",
        cost: a => 1e200,

        effect(a) {
            let x = player.bh.dm.add(10).log10().pow(2)
            return x
        },
        effDesc: x => formatMult(x),
    },
}

export const BH_effects = [
    x => `the normal mass by <h3>${formatMult(x)}</h3>`,
    x => `mass of black hole by <h3>${formatMult(x)}</h3>`,
    x => `rage powers by <h3>${formatMult(x)}</h3>`,
]

export const ABH_effects = [
    x => `mass of black hole by <h3>${formatMult(x)}</h3>`,
    x => `mass of anti-black hole by <h3>${formatMult(x)}</h3>`,
    x => `dark matter by <h3>${formatMult(x)}</h3>`,
]

function getBHEffect() {
    var bh = player.bh.mass

    var a = [
        bh.root(hasUpgrade('bh6') ? 2 : 4).mul(10).add(1).pow(simpleAchievementEffect(26)),
        expPow(bh.add(1), 0.5).pow(upgradeEffect('bh2')).pow(simpleAchievementEffect(26)),
    ]

    if (hasUpgrade('bh6')) a[2] = expPow(bh.add(1), 0.4).pow(simpleUpgradeEffect('bh8')).pow(simpleAchievementEffect(26));

    return a
}

function getABHEffect() {
    var bh = player.bh.anti_mass

    var a = [
        bh.root(2).mul(10).add(1).pow(simpleAchievementEffect(36)),
        expPow(bh.add(1), 0.5).pow(simpleUpgradeEffect('bh8')).pow(simpleAchievementEffect(36)),
    ]

    if (hasUpgrade('bh11')) a[2] = expPow(bh.add(1), 0.4).pow(player.mlt.times.gte(4) ? simpleUpgradeEffect('bh8') : 1).pow(simpleAchievementEffect(36));

    return a
}

createTempUpdate("updateBHTemp", ()=>{
    temp.bh_effect = getBHEffect()
    temp.abh_effect = getABHEffect()
})