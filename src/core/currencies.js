import { hasUpgrade, simpleUpgradeEffect, upgradeEffect } from "./upgrades";

export const CURRENCIES = {
    mass: {
        name: "Normal Mass",
        costName: "of normal mass",

        get amount() { return player.mass },
        set amount(v) { player.mass = v.max(0) },
    
        get gain() {
            let x = DC.D1.add(upgradeEffect('m1',0)).mul(rankEffect(0,3)).mul(upgradeEffect('r1')).mul(temp.bh_effect[0])

            if (hasAchievement(13)) x = x.mul(3);

            x = x.pow(temp.mlt_effect[0]).pow(rankEffect(0,10))
            if (player.ranks[1].gte(2)) x = x.pow(1.15);

            return x
        },
    },
    rage: {
        name: "Rage Powers",

        get require() { return 1e18 },

        get amount() { return player.rage.powers },
        set amount(v) { player.rage.powers = v.max(0) },
    
        get gain() {
            let x = player.mass.div(this.require)

            if (x.lt(1)) return DC.D0;

            var exp = hasUpgrade('r8') ? 0.55 : 0.5

            x = expPow(x,exp).mul(rankEffect(1,3)).mul(rankEffect(0,8)).mul(temp.bh_effect[2]??1)

            if (hasUpgrade('bh12')) x = x.pow(1.15);

            return x
        },

        get passive() { return +hasUpgrade('bh7') },
    },
    'dark-matter': {
        name: "Dark Matter",

        get require() { return 1e18 },

        get amount() { return player.bh.dm },
        set amount(v) { player.bh.dm = v.max(0) },
    
        get gain() {
            let x = player.rage.powers.div(this.require)

            if (x.lt(1)) return DC.D0;

            x = expPow(x,0.5).mul(temp.abh_effect[2]??1)

            return x
        },

        get passive() { return 0 },
    },
    'black-hole': {
        name: "Black Hole",
        costName: "of black hole",

        get amount() { return player.bh.mass },
        set amount(v) { player.bh.mass = v.max(0) },
    
        get gain() {
            if (!player.bh.unlocked) return DC.D0;

            let x = DC.D1.mul(upgradeEffect('bh1')).mul(temp.bh_effect[1]).mul(temp.abh_effect[0]).mul(simpleUpgradeEffect('r10'))

            return x
        },
    },
    'anti-black-hole': {
        name: "Anti-Black Hole",
        costName: "of anti-black hole",

        get amount() { return player.bh.anti_mass },
        set amount(v) { player.bh.anti_mass = v.max(0) },
    
        get gain() {
            if (!hasUpgrade('bh8')) return DC.D0;

            let x = DC.D1.mul(temp.abh_effect[1]).mul(simpleUpgradeEffect('bh11')).mul(simpleUpgradeEffect('bh13'))

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
            let m = player.mlt.times

            if (!player.mlt.unlocked || m.lt(1)) return DC.D0;

            let x = m.sub(1).pow_base(2).mul(m).mul(upgradeEffect('mlt1')).mul(rankEffect(0,11))

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
        unl: ()=>player.first_ranks[0],
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
        unl: ()=>player.rage.unlocked,
        name: "Dark Matter",
        color: "#fe5",
        get display() {
            const curr = CURRENCIES["dark-matter"]
            var h = format(curr.amount,0) + "<br>" + (CURRENCIES.rage.amount.gte(curr.require) ? getCurrencyGainDisplay('dark-matter') : `(requires <b>${format(curr.require)}</b> RP)`)
            return h
        },
        get tooltip() {
            return `<h3>Dark Matter</h3><br class='sub-line'><i>Reach <b>${format(CURRENCIES.rage.require)}</b> rage powers to reset everything the rage does, as well as rage powers and rage upgrades for <b>Dark Matter</b>.</i>`
        },
        click() {
            doReset('dark-matter')
        },
    },
    "black-hole": {
        unl: ()=>player.bh.unlocked,
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
        unl: ()=>hasUpgrade('bh8'),
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
            let c = CURRENCIES["mlt-energy"]
            let h = `<h3>Multiverse</h3>`
            if (player.mlt.unlocked) h += `<br class='sub-line'>You have <b>${format(c.amount)}</b> ${formatGain(c.amount,temp.currency_gain['mlt-energy'])} multiversal energy.`;
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