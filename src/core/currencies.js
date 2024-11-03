import { hasUpgrade, simpleUpgradeBoost, simpleUpgradeEffect, upgradeEffect } from "./upgrades";

export const CURRENCIES = {
    mass: {
        name: "Normal Mass",
        costName: "of normal mass",

        get amount() { return player.mass },
        set amount(v) { player.mass = v.max(0) },
    
        get gain() {
            let x = DC.D1.add(upgradeEffect('m1',0)).mul(rankEffect(0,3)).mul(upgradeEffect('r1')).mul(temp.bh_effect[0])

            if (hasAchievement(13)) x = x.mul(3);

            x = x.pow(temp.mlt_effect[0]).pow(rankEffect(0,10)).pow(challengeEffect('1-3'))
            if (player.ranks[1].gte(2)) x = x.pow(1.15);
            if (insideChallenge('1-3')) x = x.pow(insideChallenge('3-3') ? .01 : .1);

            if (insideChallenge('3-1')) x = expPow(x,.5);
            if (insideChallenge('3-2')||insideChallenge('3-4')||insideChallenge('3-6')) x = expPow(x,.75);

            if (!player.mlt.broken) x = x.min(mlt(1));

            return x
        },
    },
    rage: {
        name: "Rage Powers",

        get require() { return 1e18 },
        get exponent() { return Decimal.add(hasUpgrade('r8') ? 0.55 : 0.5,challengeEffect('2-3',0)) },

        get amount() { return player.rage.powers },
        set amount(v) { player.rage.powers = v.max(0) },
    
        get gain() {
            let x = player.mass.div(this.require)

            if (x.lt(1) || insideChallenge('2-3')) return DC.D0;

            x = expPow(x,this.exponent).mul(rankEffect(1,3)).mul(rankEffect(0,8)).mul(temp.bh_effect[2]??1)

            x = x.pow(simpleUpgradeBoost('mlt8',temp.mlt_effect[0])).pow(challengeEffect('1-4'))
            if (player.ranks[0].gte(350)) x = x.pow(rankEffect(0,10));
            if (hasUpgrade('bh12')) x = x.pow(1.15);
            if (insideChallenge('1-4')) x = x.pow(insideChallenge('3-3') ? .01 : .1);

            return x
        },

        get passive() { return +hasUpgrade('bh7') },
    },
    'dark-matter': {
        name: "Dark Matter",

        get require() { return insideChallenge('2-3') ? 'e324' : 1e18 },

        get amount() { return player.bh.dm },
        set amount(v) { player.bh.dm = v.max(0) },
    
        get gain() {
            let x = (insideChallenge('2-3') ? player.mass : player.rage.powers).div(this.require)

            if (x.lt(1) || insideChallenge('3-4')) return DC.D0;

            let exp = 0.5
            exp = Decimal.add(exp,simpleUpgradeBoost('bmlt10',challengeEffect('2-3',0),0))
            if (insideChallenge('2-3')) exp = Decimal.mul(exp,CURRENCIES.rage.exponent);

            x = expPow(x,exp).mul(temp.abh_effect[2]??1)

            x = x.pow(challengeEffect('2-4')).pow(simpleUpgradeBoost('mlt15',temp.mlt_effect[0]))
            if (insideChallenge('2-4')) x = x.pow(insideChallenge('3-3') ? .01 : .1);

            return x
        },

        get passive() { return +player.mlt.times.gte(9) },
    },
    'black-hole': {
        name: "Black Hole",
        costName: "of black hole",

        get amount() { return player.bh.mass },
        set amount(v) { player.bh.mass = v.max(0) },
    
        get gain() {
            if (!player.bh.unlocked || insideChallenge('3-4')) return DC.D0;

            let x = DC.D1.mul(upgradeEffect('bh1')).mul(temp.bh_effect[1]).mul(temp.abh_effect[0]).mul(simpleUpgradeEffect('r10'))

            x = x.pow(simpleUpgradeBoost('mlt10',temp.mlt_effect[0])).pow(challengeEffect('2-4'))
            if (insideChallenge('2-4')) x = x.pow(insideChallenge('3-3') ? .01 : .1);

            if (insideChallenge('3-1')) x = expPow(x,.5);
            if (insideChallenge('3-2')||insideChallenge('3-6')) x = expPow(x,.75);

            return x
        },
    },
    'anti-black-hole': {
        name: "Anti-Black Hole",
        costName: "of anti-black hole",

        get amount() { return player.bh.anti_mass },
        set amount(v) { player.bh.anti_mass = v.max(0) },
    
        get gain() {
            if (!hasUpgrade('bh8') || insideChallenge('3-4')) return DC.D0;

            let x = DC.D1.mul(temp.abh_effect[1]).mul(simpleUpgradeEffect('bh11')).mul(simpleUpgradeEffect('bh13'))

            x = x.pow(simpleUpgradeBoost('mlt12',temp.mlt_effect[0])).pow(challengeEffect('2-4'))
            if (insideChallenge('2-4')) x = x.pow(insideChallenge('3-3') ? .01 : .1);
            
            return x
        },
    },
    'mlt-energy': {
        name: "Multiversal Energy",

        get amount() { return player.mlt.energy },
        set amount(v) { player.mlt.energy = v.max(0) },

        get total() { return player.mlt.total_energy },
        set total(v) { player.mlt.total_energy = v.max(0) },
    
        get gain() {
            let m = player.mlt.times.mul(challengeEffect('3-5')).mul(simpleAchievementEffect(61))

            if (!player.mlt.unlocked || m.lt(1)) return DC.D0;

            let x = m.pow_base(m)
            if (m.gte(6)) x = x.pow(2);
            
            x = x.mul(upgradeEffect('mlt1')).mul(rankEffect(0,11)).mul(simpleUpgradeEffect('r13')).mul(simpleUpgradeEffect('bh15')).mul(simpleUpgradeEffect('mlt9')).mul(simpleUpgradeEffect('mlt13')).mul(simpleAchievementEffect(43)).mul(simpleUpgradeEffect('bmlt3'))

            return x
        },
    },
    'mlt-fragments': {
        name: "Multiversal Fragments",

        get amount() { return player.mlt.fragments },
        set amount(v) { player.mlt.fragments = v.max(0) },

        get total() { return player.mlt.total_fragments },
        set total(v) { player.mlt.total_fragments = v.max(0) },
    
        get gain() {
            if (!player.mlt.broken) return DC.D0;

            let m = player.mlt.times.sub(17).max(0).mul(challengeEffect('3-5')).add(1)

            let x = m.pow(0.75).pow_base(m).max(1).mul(upgradeEffect('bmlt1')).mul(simpleUpgradeEffect('bmlt7'))

            return x
        },
    },
}

export function getCurrencyGainDisplay(id,passive=CURRENCIES[id].passive>0) { return passive ? formatGain(CURRENCIES[id].amount,temp.currency_gain[id]) : `(+${format(temp.currency_gain[id],0)})` }

export const TOPBAR_CURRENCIES = {
    mass: {
        unl: ()=>true,
        name: "Normal Mass",
        color: "white",
        get display() {
            const curr = CURRENCIES.mass
            var h = formatMass(curr.amount) + "<br>" + formatGain(curr.amount,temp.currency_gain.mass,true)
            return h
        },
        get tooltip() {
            return `<h3>Normal Mass</h3><br class='sub-line'>You have pushed <b>${formatMass(player.mass)}</b> of normal mass.`
        },
    },
    rage: {
        unl: ()=>!insideChallenge('2-3') && player.first_ranks[0],
        name: "Rage Powers",
        color: "#f55",
        get display() {
            const curr = CURRENCIES.rage
            var h = format(curr.amount,0) + "<br>" + (CURRENCIES.mass.amount.gte(curr.require) ? getCurrencyGainDisplay('rage') : `(requires <b>${formatMass(curr.require)}</b>)`)
            return h
        },
        get tooltip() {
            return `<h3>Rage Powers</h3><br class='sub-line'><i>Reach <b>${formatMass(CURRENCIES.rage.require)}</b> of normal mass to reset your mass upgrades and ranks for <b>Rage Powers</b>.</i>`
        },
        click() {
            doReset('rage')
        },
    },
    "dark-matter": {
        unl: ()=>!insideChallenge('3-4') && player.rage.unlocked,
        name: "Dark Matter",
        color: "#fe5",
        get display() {
            const curr = CURRENCIES["dark-matter"]
            var h = format(curr.amount,0) + "<br>" + (CURRENCIES.rage.amount.gte(curr.require) ? getCurrencyGainDisplay('dark-matter') : insideChallenge('2-3') ? `(requires <b>${formatMass(CURRENCIES["dark-matter"].require)}</b>)` : `(requires <b>${format(curr.require)}</b> RP)`)
            return h
        },
        get tooltip() {
            let c = insideChallenge('2-3') ? `<b>${formatMass(CURRENCIES["dark-matter"].require)}</b> of normal mass` : `<b>${format(CURRENCIES["dark-matter"].require)}</b> rage powers`
            return `<h3>Dark Matter</h3><br class='sub-line'><i>Reach ${c} to reset everything the rage does, as well as rage powers and rage upgrades for <b>Dark Matter</b>.</i>`
        },
        click() {
            doReset('dark-matter')
        },
    },
    "black-hole": {
        unl: ()=>!insideChallenge('3-4') && player.bh.unlocked,
        name: "Black Hole",
        color: "#fe5",
        get display() {
            const curr = CURRENCIES["black-hole"]
            var h = formatMass(curr.amount) + "<br>" + formatGain(curr.amount,temp.currency_gain['black-hole'],true)
            return h
        },
        get tooltip() {
            return `<h3>Black Hole</h3><br class='sub-line'>You have pushed <b>${formatMass(player.bh.mass)}</b> of black hole.`
        },
    },
    "anti-black-hole": {
        unl: ()=>!insideChallenge('3-4') && hasUpgrade('bh8'),
        name: "Anti-Black Hole",
        color: "#5ef",
        get display() {
            const curr = CURRENCIES["anti-black-hole"]
            var h = formatMass(curr.amount) + "<br>" + formatGain(curr.amount,temp.currency_gain['anti-black-hole'],true)
            return h
        },
        get tooltip() {
            return `<h3>Anti-Black Hole</h3><br class='sub-line'>You have pushed <b>${formatMass(player.bh.anti_mass)}</b> of anti-black hole.`
        },
    },
    "mlt": {
        unl: ()=>player.mlt.unlocked||hasUpgrade('bh8'),
        name: "Multiverses",
        color: "#ff7fed",
        get display() {
            let req = MULTIVERSE.require(), bulk = MULTIVERSE.bulk
            var h = format(player.mlt.times,0) + "<br>" + (player.mass.gte(req) ? `(+${format(bulk.sub(player.mlt.times).max(0),0)}, next at <b>${formatMass(MULTIVERSE.require(bulk))}</b>)` : `(requires <b>${formatMass(req)}</b>)`)
            return h
        },
        get tooltip() {
            let c = CURRENCIES["mlt-energy"], b = CURRENCIES["mlt-fragments"]
            let h = `<h3>Multiverse</h3>`
            if (player.mlt.unlocked) h += `<br class='sub-line'>You have <b>${format(c.amount)}</b> ${formatGain(c.amount,temp.currency_gain['mlt-energy'])} multiversal energy.`;
            if (player.mlt.broken)  h += `<br>You have <b>${format(b.amount)}</b> ${formatGain(b.amount,temp.currency_gain['mlt-fragments'])} multiversal fragments.`;
            h += `<br class='sub-line'><i>Reach <b>${formatMass(MULTIVERSE.require())}</b> of normal mass to reset everything the black hole does, as well as dark matter, the black hole, the black hole upgrades, and the anti-black hole to raise the Multiverse.</i>`
            return h
        },
        click() {
            doReset('multiverse')
        },
    },
}

export function gainCurrency(id,amt) {
    var curr = CURRENCIES[id]
    curr.amount = curr.amount.add(amt)
    if ('total' in curr) curr.total = curr.total.add(amt)
}

createTempUpdate("updateCurrenciesTemp", ()=>{
    for (let [i,v] of Object.entries(CURRENCIES)) temp.currency_gain[i] = preventNaNDecimal(v.gain??E(0))
})