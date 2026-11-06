/**
 * O rodapé de cada passo do gps-mass-update (export, load e checking-execute) é position:fixed.
 * A largura calculada a partir do host do po-widget inclui o padding da grade (po-sm-12) e não coincide
 * com a borda visível do card, e sem "left" o rodapé fica onde estaria no fluxo, deslocado pelo padding
 * interno do card. Por isso posição e largura são medidas no próprio card (div.po-widget-container)
 * e aplicadas ao rodapé a cada redimensionamento.
 */
export function alignFooterToCard(footer: HTMLElement): ResizeObserver | null {
  const widget = footer.closest<HTMLElement>('po-widget') ?? document.querySelector<HTMLElement>('po-widget');
  if (!widget) {
    return null;
  }

  const card = widget.querySelector<HTMLElement>('.po-widget-container') ?? widget;

  const observer = new ResizeObserver(() => {
    const { left, width } = card.getBoundingClientRect();
    footer.style.left = left + 'px';
    footer.style.width = width + 'px';
  });
  observer.observe(card);

  return observer;
}
