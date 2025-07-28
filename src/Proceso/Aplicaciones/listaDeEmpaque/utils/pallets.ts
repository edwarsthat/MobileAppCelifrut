
export function getPalletButtonStyle(selected: boolean, free: boolean, color: string | undefined, styles: any) {
    if (selected) { return styles.palletSelected; }
    if (free) { return styles.palletLiberado; }
    return { backgroundColor: color || 'white' };
}
