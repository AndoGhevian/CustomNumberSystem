export const HorizontalDirection: ['left', 'right'] = ['left', 'right']
export const VarticalDirection: ['up', 'down'] = ['up', 'down']
export const DecimalDigsGeneratorMode: ['classic', 'bigint'] = ['classic', 'bigint']

export type HorizontalDirection = (typeof HorizontalDirection)[number]
export type VarticalDirection = (typeof VarticalDirection)[number]
export type DecimalDigsGeneratorMode = (typeof DecimalDigsGeneratorMode)[number]