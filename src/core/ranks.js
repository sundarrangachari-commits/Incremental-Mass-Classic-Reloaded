import { DC } from "./decimal"
import { updateTemp } from "./temp"

export const RANKS = [
    {
        name: "Rank",
        unl: () => true,
        auto: () => player.first_ranks[1],

        get fp() { return Decimal.mul(simpleAchievementEffect(34),temp.ranks_fp).mul(challengeEffect('2-1')) },

        require(a) { return insideChallenge('2-1') ? EINF : a.div(this.fp).sumBase(1.01).pow(1.5).add(1).pow_base(player.ranks[1].gte(1) ? 8 : 10).div(hasUpgrade('r9')?upgradeEffect('m4'):1).max(1).root(player.ranks[3].gte(2) ? upgradeEffect('m5') : 1) },
        bulk(a) { return insideChallenge('2-1') ? DC.D0 : a.pow(player.ranks[3].gte(2) ? upgradeEffect('m5') : 1).mul(hasUpgrade('r9')?upgradeEffect('m4'):1).log(player.ranks[1].gte(1) ? 8 : 10).sub(1).root(1.5).sumBase(1.01,true).mul(this.fp).floor().add(1) },

        rewards: {
            "1": [
                `Unlock the first mass upgrade.`
            ],
            "2": [
                `Unlock the second mass upgrade. Reduce the scaling of the first mass upgrade.`
            ],
            "3": [
                `Unlock the third mass upgrade. Reduce the scaling of the second mass upgrade. The first mass upgrade boosts itself.`
            ],
            "4": [
                `Reduce the scaling of the third mass upgrade. Rank boosts the normal mass.`,
                ()=>player.ranks[0].sub(2).pow(player.ranks[0].gte(17) ? player.ranks[0].root(player.ranks[1].gte(19) ? 1 : 3) : 2), 1, x=>formatMult(x),
            ],
            "5": [
                `The second mass upgrade boosts itself.`
            ],
            "17": [ // 5
                `Improve the <b>Rank 4</b>'s effect.`,
            ],
            "32": [
                `Increase the base of the third mass upgrade by <b>+10%</b> additively.`
            ],
            "44": [
                `Increase the base of <b>r1</b> upgrade by <b>+1%</b> per <b>Rank</b>.`,
                ()=>player.ranks[0].mul(.01).add(1).pow(player.ranks[1].gte(10)?3:1), 1, x=>formatMult(x),
            ],
            "57": [
                `Increase rage powers gained by <b>+10%</b> compounding per <b>Rank</b>.`,
                ()=>player.ranks[0].pow_base(1.1).pow(player.ranks[0].gte(107)?rankEffect(1,5):1), 1, x=>formatMult(x),
            ],
            "107": [
                `<b>Tier 7</b> affects the <b>Rank 57</b>'s effect.`,
            ],
            "150": [ // 10
                `The exponent of the normal mass is increased by <b>+1%</b> per <b>Rank</b><sup>0.75</sup>, starting at 150.`,
                ()=>player.ranks[0].sub(149).max(0).pow(0.75).mul(.01).add(1), 1, x=>formatPow(x,4),
            ],
            "230": [
                `Increase multiversal energy generation by <b>+10%</b> compounding per <b>Rank</b><sup>0.75</sup>.`,
                ()=>player.ranks[0].max(0).pow(0.75).pow_base(1.1), 1, x=>formatMult(x),
            ],
            "350": [
                `<b>Rank 150</b> affects rage powers.`,
            ],
        },
    },{
        name: "Tier",
        unl: () => player.first_ranks[0],
        auto: () => hasUpgrade('r4'),

        get fp() { return temp.ranks_fp },
        
        require(a) { return a.div(this.fp).add(2).pow(player.ranks[2].gte(1) ? 1.8 : 2).round() },
        bulk(a) { return a.root(player.ranks[2].gte(1) ? 1.8 : 2).sub(2).mul(this.fp).add(1).floor() },

        rewards: {
            "1": [
                `Reduce the Rank requirement. Automatically update Rank.`
            ],
            "2": [
                `Normal mass is raised to the <b>1.15th</b> power.`
            ],
            "3": [
                `Reduce the scaling of the third mass upgrade further.`
            ],
            "4": [
                `<b>Triple</b> rage powers gained per <b>Tier</b>.`,
                ()=>player.ranks[1].pow_base(3).pow(rankEffect(1,5)), 1, x=>formatMult(x),
            ],
            "5": [
                `Increase the base of <b>r1</b> upgrade by <b>+10%</b> per <b>Tier</b>.`,
                ()=>player.ranks[1].mul(.1).add(1).pow(player.ranks[1].gte(10)?3:1), 1, x=>formatMult(x),
            ],
            "7": [ // 5
                `Unspent dark matter raises the effect of <b>Tier 4</b> at a reduced rate.`,
                ()=>expPow(player.bh.dm.add(10).log10(),0.5), 1, x=>formatPow(x),
            ],
            "10": [
                `Improve the <b>Rank 44</b> & <b>Tier 5</b>' effect.`,
            ],
            "19": [
                `Improve the <b>Rank 4</b>'s effect significantly.`,
            ],
        },
    },{
        name: "Tetr",
        unl: () => player.mlt.times.gte(2),
        auto: () => player.mlt.times.gte(3),

        get fp() { return temp.ranks_fp },

        require(a) { return a.div(this.fp).add(4).pow(1.6).round() },
        bulk(a) { return a.root(1.6).sub(4).mul(this.fp).add(1).floor() },

        rewards: {
            "1": [
                `Reduce the Tier requirement.`
            ],
            "2": [
                `The third mass upgrade boosts itself.`
            ],
            "3": [
                `The <b>r1</b> upgrade is <b>15%</b> stronger.`,
                ()=>1.15,1
            ],
            "5": [
                `The <b>m1-4</b> upgrades are <b>+5%</b> stronger per <b>Tetr</b> additively.`,
                ()=>player.ranks[2].div(20),DC.D0,x=>"+"+formatPercent(x)
            ],
        },
    },{
        name: "Pent",
        unl: () => player.mlt.times.gte(20),
        auto: () => player.mlt.times.gte(20),

        get fp() { return temp.ranks_fp },

        require(a) { return a.div(this.fp).add(5).pow(1.7).round() },
        bulk(a) { return a.root(1.7).sub(5).mul(this.fp).add(1).floor() },

        rewards: {
            "1": [
                `Unlock the fifth mass upgrade.`
            ],
            "2": [
                `The fifth mass upgrade affects the <b>Rank</b> requirement normally.`
            ],
            "3": [
                `<b>x10</b> to the base of the third mass upgrade. The fifth mass upgrade affects the <b>r1</b> upgrade.`
            ],
            "5": [
                `Unlock the sixth mass upgrade.`
            ],
        },
    },
]

export const RANKS_LEN = RANKS.length

export function resetRank(id) {
    for (let i = id-1; i >= 0; i--) {
        player.ranks[i] = DC.D0
    }

    player.mass = DC.D0
    resetUpgradesByGroup('mass')

    updateTemp()
}

export function rankUp(id) {
    const R = RANKS[id]
    if (R.unl() && R.res.gte(R.require(R.amount))) {
        R.amount = R.bulk(R.res).max(R.amount.add(1))
        player.first_ranks[id] = true
        resetRank(id)
    }
}

export function rankEffect(id,i,def=1) { return temp.rank_effects[id][i] ?? def }

createTempUpdate('updateRanksTemp', ()=>{
    temp.ranks_fp = insideChallenge('1-1') ? 1/3 : 1

    for (let i = 0; i < RANKS_LEN; i++) {
        const R = RANKS[i], amount = R.amount, TR = temp.rank_effects[i], RRK = Object.keys(R.rewards);

        for (let r = 0; r < RRK.length; r++) {
            const RB = RRK[r], RR = R.rewards[RB]

            if (RR[1]) TR[r] = amount.gte(RB) ? RR[1]() : RR[2];
        }
    }
})