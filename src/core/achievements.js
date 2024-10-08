export const ACHIEVEMENTS = {
    11: {
        title: `One must imagine Sisyphus happy`,
        get description() { return `Reach <b>Rank 1</b>.` },
        condition: ()=>player.ranks[0].gte(1),
    },
    12: {
        title: `TEN MILLION POWER!!!`,
        get description() { return `Reach <b>${formatMass(1e7)}</b> of normal mass.` },
        condition: ()=>player.mass.gte(1e7),
    },
    13: {
        title: `Who put this dawg on the deep fryer?`,
        get description() { return `Perform the <b>Rage</b>.` },
        get reward() { return `Push <b>${formatMult(3)}</b> more normal mass.` },
    },
    14: {
        title: `Upgraded Sisyphus`,
        get description() { return `Reach <b>Tier 1</b>.` },
        condition: ()=>player.ranks[1].gte(1),
    },
    15: {
        title: `No upgrades are clueless`,
        get description() { return `Reach <b>Rank 10</b> without any mass upgrades bought.` },
        condition: ()=>player.ranks[0].gte(10) && !UPG_GROUPS.mass.find(x => hasUpgrade(x)),
    },
    16: {
        title: `No softcaps? It wasn’t a good idea`,
        get description() { return `Get over <b>^10</b> of the third mass upgrade’s effect.` },
        get reward() { return `The third mass upgrade is <b>10%</b> stronger.` },
        condition: ()=>Decimal.gte(upgradeEffect('m3'),10),
    },

    21: {
        title: `Melanoheliophobia`,
        get description() { return `Perform the <b>Black Hole</b>.` },
    },
    22: {
        title: `Pushing the universe goes wrong`,
        get description() { return `Reach <b>${formatMass(1.5e56)}</b> of normal mass.` },
        condition: ()=>player.mass.gte(1.5e56),
    },
    23: {
        title: `Small Roar`,
        get description() { return `Purchase the <b>bh6</b> upgrade.` },
        condition: ()=>hasUpgrade('bh6'),
    },
    24: {
        title: `I ate without cheapness`,
        get description() { return `Reach <b>${formatMass('1.5e806')}</b> of normal mass without purchasing the fourth mass upgrade.` },
        get reward() { return `The fourth mass upgrade applies to the <b>r1</b> upgrade at a dilated rate (10<sup>lg(x)<sup>${format(1/3,4)}</sup></sup>).` },
        effect: [()=>expPow(Decimal.max(upgradeEffect('m4'),1),1/3),x=>formatMult(x.pow(-1))],
        condition: ()=>!hasUpgrade('m4') && player.mass.gte('1.5e806'),
    },
    25: {
        title: `No more aggressions!`,
        get description() { return `Perform the <b>Black Hole</b> without purchasing any non-QoL rage upgrades.` },
    },
    26: {
        title: `Pushing the black hole-`,
        get description() { return `Reach <b>${formatMass(1.5e56)}</b> of the black hole.` },
        get reward() { return `The black hole's effects is <b>10%</b> stronger.` },
        effect: [()=>1.1],
        condition: ()=>player.bh.mass.gte(1.5e56),
    },
    
    31: {
        title: `Upper Limit`,
        get description() { return `Reach <b>${formatMass('1.5e1056')}</b> of normal mass.` },
        condition: ()=>player.mass.gte('1.5e1056'),
    },
    32: {
        title: `New Generation`,
        get description() { return `Reach the first <b>Multiverse</b>.` },
        condition: ()=>player.mlt.times.gte(1),
    },
    33: {
        title: `Tetrahedron`,
        get description() { return `Reach <b>Tetr 1</b>.` },
        condition: ()=>player.ranks[2].gte(1),
    },
    34: {
        title: `No scalings? Goddammit`,
        get description() { return `Reach <b>Rank 256</b>.` },
        get reward() { return `Gain <b>${formatMult(1.1)}</b> more Rank.` },
        effect: [()=>1.1],
        condition: ()=>player.ranks[0].gte(256),
    },
    35: {
        title: `Googol times heavier than caseoh`,
        get description() { return `Have normal mass per second <b>googol</b> times (<b>${formatMult(1e100)}</b>) greater than your current normal mass.` },
    },
    36: {
        title: `Gnorw seog esrevinu eht gnihsup`,
        get description() { return `Reach <b>${formatMass(1.5e56)}</b> of the anti-black hole.` },
        get reward() { return `The anti-black hole's effects is <b>10%</b> stronger.` },
        effect: [()=>1.1],
        condition: ()=>player.bh.anti_mass.gte(1.5e56),
    },
}

export const ACHIEVEMENTS_KEYS = Object.keys(ACHIEVEMENTS).map(x=>parseInt(x))
export const ACHIEVEMENTS_VISIBLE = (()=>{
    let a = {}
    for (let i of ACHIEVEMENTS_KEYS) a[i] = ACHIEVEMENTS[i] !== null;
    return a
})()

export const MAX_ACHIEVEMENT_ROWS = Math.ceil((ACHIEVEMENTS.length - 1) / 6)

export function getAchievementTooltip(id) {
    const ach = ACHIEVEMENTS[id]
    var h = ""

    h += `<h4>${ach.title}</h4>`
    h += `<br class='sub-line'>${ach.description}`

    if ("reward" in ach) h += `<br class='sub-line'><i><b>Reward:</b> ${ach.reward}</i>`;
    if ("effect" in ach && ach.effect?.[1]) h += `<br class='sub-line'><i><b>Effect:</b> ${ach.effect[1](temp.achievement_effects[id])}</i>`;

    return h
}

export function checkAchievements() {
    for (let i of ACHIEVEMENTS_KEYS) if (ACHIEVEMENTS_VISIBLE[i] && !player.achievements.includes(i) && ACHIEVEMENTS[i].condition?.()) giveAchievement(i);
}
export function giveAchievement(id) {
    if (!player.achievements.includes(id)) {
        player.achievements.push(id);
        addNotify(`<b>Achievement Unlocked:</b> ${ACHIEVEMENTS[id].title}`);
    }
}

export function hasAchievement(id) { return player.achievements.includes(id) }
export function simpleAchievementEffect(id,def=1) { return hasAchievement(id) ? temp.achievement_effects[id] ?? def : def }

createTempUpdate("updateAchievementsTemp", ()=>{
    for (let [id,a] of Object.entries(ACHIEVEMENTS)) {
        id = parseInt(id)
        if ('effect' in a) temp.achievement_effects[id] = a.effect[0]();
    }
})