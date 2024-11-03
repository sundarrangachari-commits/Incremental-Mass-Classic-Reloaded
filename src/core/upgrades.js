import { BH_UPGRADES } from "./black-hole"
import { MLT_UPGRADES } from "./mlt/multiverse"

export const UPGRADES = {
    'm1': {
        unl: ()=>hasUpgrade('bh3') || player.ranks[0].gte(1),
        mass: true,
        get description() { return `Increase the base of normal mass by <b>+${this.base.format()}</b> per level.` },

        curr: "mass",
        cost: a => a.pow_base(player.ranks[0].gte(2) ? 1.25 : 1.5).mul(10).div(upgradeEffect('m4')).max(1).root(upgradeEffect('m5')),
        bulk: a => a.pow(upgradeEffect('m5')).mul(upgradeEffect('m4')).div(10).log(player.ranks[0].gte(2) ? 1.25 : 1.5).floor().add(1),

        get bonus() { return simpleUpgradeEffect('r5',0) },
        get strength() { return insideChallenge('3-5') ? 0.01 : Decimal.add(1,simpleUpgradeEffect('r11',0)).add(rankEffect(2,3)).mul(challengeEffect('1-1')).mul(upgradeEffect('bmlt2')) },
        get base() {
            let b = DC.D1
            if (player.ranks[0].gte(3)) b = b.add(player.upgrades.m1.div(10))
            b = b.mul(upgradeEffect('m2'))
            return b
        },
        effect(a) {
            let x = a.mul(this.base).pow(upgradeEffect('m3',DC.D1).pow(upgradeEffect('bmlt9',0)))
            return x
        },
        effDesc: x => `+${format(x)}`,
    },
    'm2': {
        unl: ()=>hasUpgrade('bh3') || player.ranks[0].gte(2),
        mass: true,
        get description() { return `Increase the base of <b>m1</b> upgrade by <b>+${formatPercent(this.base)}</b> per level.` },

        curr: "mass",
        cost: a => a.pow_base(player.ranks[0].gte(3) ? 2 : 3).mul(100).div(upgradeEffect('m4')).max(1).root(upgradeEffect('m5')),
        bulk: a => a.pow(upgradeEffect('m5')).mul(upgradeEffect('m4')).div(100).log(player.ranks[0].gte(3) ? 2 : 3).floor().add(1),

        get bonus() { return simpleUpgradeEffect('r5',0) },
        get strength() { return insideChallenge('3-5') ? 0.01 : Decimal.add(1,simpleUpgradeEffect('r11',0)).add(rankEffect(2,3)).mul(challengeEffect('1-1')).mul(upgradeEffect('bmlt2')) },
        get base() {
            let b = DC.D1
            if (player.ranks[0].gte(5)) b = b.add(player.upgrades.m2.div(10))
            return b
        },
        effect(a) {
            let x = a.mul(this.base).add(1).pow(upgradeEffect('m3'))
            return x
        },
        effDesc: x => formatMult(x),
    },
    'm3': {
        unl: ()=>hasUpgrade('bh3') || player.ranks[0].gte(3),
        mass: true,
        get description() { return `Increase the exponent of the effect of <b>m2</b> upgrade by <b>+${formatPercent(this.base)}</b> per level.` },

        curr: "mass",
        cost: a => a.sumBasePO(temp.upg.m3_fp).pow(1.25).pow_base(player.ranks[0].gte(4) ? 6 : 9).mul(1e3).div(upgradeEffect('m4')).max(1).root(upgradeEffect('m5')),
        bulk: a => a.pow(upgradeEffect('m5')).mul(upgradeEffect('m4')).div(1e3).log(player.ranks[0].gte(4) ? 6 : 9).root(1.25).sumBasePO(temp.upg.m3_fp,true).floor().add(1),

        get bonus() { return Decimal.add(simpleUpgradeEffect('r5',0),simpleUpgradeEffect('mlt2',0)).add(simpleUpgradeEffect('mlt5',0)) },
        get strength() { return insideChallenge('3-5') ? 0.01 : Decimal.add(hasAchievement(16) ? 1.1 : 1,simpleUpgradeEffect('r11',0)).add(rankEffect(2,3)).mul(challengeEffect('1-1')).mul(simpleAchievementEffect(44)).mul(upgradeEffect('bmlt2')) },
        get base() {
            let b = Decimal.add(0.5,simpleUpgradeEffect('r3',0))
            if (player.ranks[0].gte(32)) b = b.add(.1);
            if (player.ranks[2].gte(2)) b = b.add(player.upgrades.m3.div(100));
            if (player.ranks[3].gte(3)) b = b.mul(10);
            b = b.mul(challengeEffect('3-2'))
            return b
        },
        effect(a) {
            let x = a.mul(this.base).add(1).pow(upgradeEffect('m6'))
            return x
        },
        effDesc: x => formatPow(x),
    },
    'm4': {
        unl: ()=>hasUpgrade('bh3'),
        mass: true,
        get description() { return `The first three mass upgrades are <b>${formatMult(this.base)}</b> cheaper per level.` },

        curr: "mass",
        cost: a => a.sumBasePO(temp.upg.m4_fp).pow_base(3).mul(1e3).root(upgradeEffect('m5')),
        bulk: a => a.pow(upgradeEffect('m5')).div(1e3).log(3).sumBasePO(temp.upg.m4_fp,true).floor().add(1),

        get strength() { return insideChallenge('3-5') ? 0.01 : Decimal.add(1,simpleUpgradeEffect('r11',0)).add(rankEffect(2,3)).mul(challengeEffect('1-1')).mul(upgradeEffect('bmlt2')) },
        get base() {
            let b = Decimal.add(2,simpleUpgradeEffect('r7',0)).mul(simpleUpgradeEffect('r14')).mul(simpleUpgradeEffect('r15'))
            return b
        },
        effect(a) {
            let x = a.pow_base(this.base)
            return x
        },
        effDesc: x => formatMult(x.pow(-1)),
    },
    'm5': {
        unl: ()=>player.ranks[3].gte(1),
        mass: true,
        get description() { return `The first four mass upgrades are <b>${formatPow(this.base)}</b> cheaper per level.` },

        curr: "mass",
        cost: a => a.sumBasePO(0.05).pow_base(1.1).pow_base('1.5e1000000056'),
        bulk: a => a.log('1.5e1000000056').log(1.1).sumBasePO(0.05,true).floor().add(1),

        get strength() { return 1 },
        get base() {
            let b = Decimal.mul(2,challengeEffect('3-2'))
            return b
        },
        effect(a) {
            let x = a.pow_base(this.base)
            return x
        },
        effDesc: x => formatPow(x),
    },
    'm6': {
        unl: ()=>player.ranks[3].gte(5),
        mass: true,
        get description() { return `Increase the exponent of the effect of <b>m3</b> upgrade by <b>+${formatPercent(this.base)}</b> per level.` },

        curr: "mass",
        cost: a => a.sumBasePO(0.1).pow_base(10).pow_base('ee24'),
        bulk: a => a.log('ee24').log(10).sumBasePO(0.1,true).floor().add(1),

        get strength() { return 1 },
        get base() {
            let b = .05
            return b
        },
        effect(a) {
            let x = a.mul(this.base).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },

    'r1': {
        unl: ()=>player.rage.unlocked,
        get description() { return `Increase the normal mass by <b>${formatMult(this.base)}</b> per level, based on your normal mass.` },

        curr: "rage",
        cost: a => a.sumBase(1.01).pow_base(2).div(simpleAchievementEffect(24)).max(1).root(player.ranks[3].gte(3) ? upgradeEffect('m5') : 1),
        bulk: a => a.pow(player.ranks[3].gte(3) ? upgradeEffect('m5') : 1).mul(simpleAchievementEffect(24)).log(2).sumBase(1.01,true).floor().add(1),

        get bonus() { return upgradeEffect('mlt2',0) },
        get strength() { return insideChallenge('3-5') ? 0.01 : Decimal.add(rankEffect(2,2),simpleUpgradeEffect('r11',0)).mul(challengeEffect('1-2')).mul(upgradeEffect('bmlt2')) },
        get base() {
            let b = player.mass.add(10).log10().root(hasUpgrade('r12') ? 1 : 2).mul(rankEffect(1,4)).mul(rankEffect(0,7))
            return b
        },
        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    'r2': {
        qol: true,
        max: 1,

        unl: ()=>player.rage.unlocked,
        get description() { return `Automate mass upgrades without spending any resources.` },

        curr: "rage",
        cost: a => 1e6,
    },
    'r3': {
        max: 1,

        unl: ()=>player.rage.unlocked,
        get description() { return `Unspent rage powers increase the base of <b>m3</b> upgrade at a reduced rate.` },

        curr: "rage",
        cost: a => 1e10,

        effect(a) {
            let x = player.rage.powers.add(10).log10().log10().div(10)
            if (hasUpgrade('bh10')) x = x.max(expPow(player.rage.powers.add(1).log10(),0.5).div(15));
            if (hasUpgrade('r6')) x = x.mul(3);
            return x
        },
        effDesc: x => "+"+format(x,4),
    },
    'r4': {
        qol: true,
        max: 1,

        unl: ()=>player.rage.unlocked,
        get description() { return `Automatically update Tier.` },

        curr: "rage",
        cost: a => 1e12,
    },
    'r5': {
        max: 1,

        unl: ()=>player.rage.unlocked,
        get description() { return `The <b>r1</b> upgrade adds bonus <b>m1-3</b> upgrades at a reduced rate.` },

        curr: "rage",
        cost: a => 1e15,

        effect(a) {
            let x = player.upgrades.r1.add(1).log(4).pow(2).div(1.5)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    'r6': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `The <b>r3</b> upgrade is <b>thrice</b> stronger.` },

        curr: "rage",
        cost: a => 1e21,
    },
    'r7': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `The normal mass increases the base of <b>m4</b> upgrade as a base of <b>r1</b>.` },

        curr: "rage",
        cost: a => 1e30,

        effect(a) {
            let x = player.mass.add(1).log10().root(3)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    'r8': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `Improve the formula of rage power's base.` },

        curr: "rage",
        cost: a => 1e42,
    },
    'r9': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `The <b>m4</b> upgrade affects the rank requirement.` },

        curr: "rage",
        cost: a => 1e72,
    },
    'r10': {
        max: 1,

        unl: ()=>player.bh.unlocked,
        get description() { return `The black hole is boosted by unspent rage powers.` },

        curr: "rage",
        cost: a => 1e120,

        effect(a) {
            let x = expPow(player.rage.powers,0.5).pow(2)
            return x
        },
        effDesc: x => formatMult(x),
    },
    'r11': {
        max: 1,

        unl: ()=>player.mlt.unlocked,
        get description() { return `The <b>m1-4</b> and <b>r1</b> upgrades are stronger based on your rage powers.` },

        curr: "rage",
        cost: a => '1e600',

        effect(a) {
            let x = player.rage.powers.add(10).log10().log10().pow(2).div(25)
            return x
        },
        effDesc: x => "+"+formatPercent(x),
    },
    'r12': {
        max: 1,

        unl: ()=>player.mlt.unlocked,
        get description() { return `Improve the normal mass boost for the base of <b>r1</b> upgrade.` },

        curr: "rage",
        cost: a => '1e900',
    },
    'r13': {
        max: 1,

        unl: ()=>player.mlt.unlocked,
        get description() { return `Rage powers boost multiversal energy generation.` },

        curr: "rage",
        cost: a => 'e1000',

        effect(a) {
            let x = player.rage.powers.add(10).log10()
            return x
        },
        effDesc: x => formatMult(x),
    },
    'r14': {
        max: 1,

        unl: ()=>player.mlt.unlocked,
        get description() { return `The mass of black hole increases the base of <b>m4</b> upgrade.` },

        curr: "rage",
        cost: a => 'e25000',

        effect(a) {
            let x = player.bh.mass.add(10).log10().root(3)
            return x
        },
        effDesc: x => formatMult(x),
    },
    'r15': {
        max: 1,

        unl: ()=>player.mlt.unlocked,
        get description() { return `The mass of anti-black hole increases the base of <b>m4</b> upgrade.` },

        curr: "rage",
        cost: a => 'e1e6',

        effect(a) {
            let x = player.bh.anti_mass.add(10).log10().root(2)
            return x
        },
        effDesc: x => formatMult(x),
    },

    ...BH_UPGRADES,
    ...MLT_UPGRADES,
}

export const UPG_KEYS = Object.keys(UPGRADES)

export const UPG_GROUPS = {
    'mass': ['m1','m2','m3','m4','m5','m6'],
    'rage': ['r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12','r13','r14','r15'],
    'bh': ['bh1','bh2','bh3','bh4','bh5','bh6','bh7','bh8','bh9','bh10','bh11','bh12','bh13','bh14','bh15'],
    'mlt': ['mlt1','mlt2','mlt3','mlt4','mlt5','mlt6','mlt7','mlt8','mlt9','mlt10','mlt11','mlt12','mlt13','mlt14','mlt15'],
    'break_mlt': ['bmlt1','bmlt2','bmlt3','bmlt4','bmlt5','bmlt6','bmlt7','bmlt8','bmlt9','bmlt10'],
}

export const AUTO_UPG_GROUPS = {
    'mass': () => hasUpgrade('r2'),
    'rage': () => hasUpgrade('bh5'),
    'bh': () => player.mlt.times.gte(4),
    'mlt': () => player.mlt.times.gte(31),
}

export const LOCKED_UPG_GROUPS = {
    'mass': () => insideChallenge('1-2'),
    'rage': () => insideChallenge('2-2'),
    'bh': () => insideChallenge('3-2'),
}

export function hasUpgrade(id,lvl=1) { return player.upgrades[id].gte(lvl) }
export function upgradeEffect(id,def=1) { return temp.upgrade_effects[id] ?? def }
export function simpleUpgradeEffect(id,def=1) { return hasUpgrade(id) ? temp.upgrade_effects[id] ?? def : def }
export function simpleUpgradeBoost(id,boost,def=1) { return hasUpgrade(id) ? boost : def }
export function getTotalUpgrades(id) { return Decimal.add(player.upgrades[id] ?? 0,temp.bonus_upgrades[id] ?? 0) }

export function buyUpgrade(id,bulk=false,auto=false) {
    if (temp.locked_upgrades[id]) return;

    const u = UPGRADES[id], curr = CURRENCIES[u.curr], max = u.max ?? EINF, lvl = player.upgrades[id];
    bulk &&= max > 1;
    var cost;

    if (u.unl() && lvl.lt(max) && curr.amount.gte(cost = u.cost(lvl))) {
        let b = lvl.add(1);

        if (bulk) {
            b = b.max(u.bulk?.(curr.amount) ?? 1);
            cost = u.cost(b.sub(1));
        }

        if (!auto) curr.amount = curr.amount.sub(cost).max(0);
        player.upgrades[id] = b
    }
}

export function resetUpgrades(list=[],keep=[]) {
    for (let id of list) if (!keep.includes(id)) player.upgrades[id] = E(0);
}
export function resetUpgradesByGroup(id,keep) { resetUpgrades(UPG_GROUPS[id],keep) }
export function hasNonQoLUpgradesByGroup(id) { return UPG_GROUPS[id].some(x => !UPGRADES[x].qol && hasUpgrade(x)) }

createTempUpdate("updateUpgradesTemp", ()=>{
    temp.auto_upgs_unlocked = {}
    temp.locked_upgrades = {}

    for (let group_id in UPG_GROUPS) {
        var auto = AUTO_UPG_GROUPS[group_id]?.(), locked = LOCKED_UPG_GROUPS[group_id]?.();
        for (let id of UPG_GROUPS[group_id]) {
            if (auto) temp.auto_upgs_unlocked[id] = true;
            if (locked) temp.locked_upgrades[id] = true;
        }
    }

    temp.upg.m3_fp = Decimal.mul(player.ranks[1].gte(3) ? .05 : .1, simpleUpgradeEffect('mlt3'))
    temp.upg.m4_fp = Decimal.mul(hasUpgrade('mlt4')?.00018:.001, 1)

    for (let [id,u] of Object.entries(UPGRADES)) {
        var level = player.upgrades[id].add(temp.bonus_upgrades[id] = u.bonus ?? 0).mul(u.strength ?? 1);

        if (!u.unl()) level = E(0);

        if (u.effect) temp.upgrade_effects[id] = u.effect(level);
    }
})