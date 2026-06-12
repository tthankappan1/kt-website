import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KtInline, ktPlain } from '@/lib/inline'

describe('KtInline (ported from prototype ktInline)', () => {
  it('renders *word* as <em> with the given class', () => {
    render(
      <h1>
        <KtInline text="The Proximity *Premium*" emClass="kt-em" />
      </h1>,
    )
    const em = screen.getByText('Premium')
    expect(em.tagName).toBe('EM')
    expect(em).toHaveClass('kt-em')
  })

  it('renders **word** as <strong>', () => {
    render(
      <p>
        <KtInline text="overbidding actually **increased** last month" />
      </p>,
    )
    expect(screen.getByText('increased').tagName).toBe('STRONG')
  })

  it('passes plain text through untouched', () => {
    render(
      <p data-testid="plain">
        <KtInline text="no emphasis here" />
      </p>,
    )
    expect(screen.getByTestId('plain')).toHaveTextContent('no emphasis here')
  })

  it('handles mixed bold and italic in one string', () => {
    render(
      <p data-testid="mixed">
        <KtInline text="a *b* c **d** e" emClass="kt-em" />
      </p>,
    )
    expect(screen.getByTestId('mixed')).toHaveTextContent('a b c d e')
    expect(screen.getByText('b').tagName).toBe('EM')
    expect(screen.getByText('d').tagName).toBe('STRONG')
  })
})

describe('ktPlain', () => {
  it('strips all asterisks', () => {
    expect(ktPlain('The 20-Minute Drive That Crosses *Two* Housing Markets')).toBe(
      'The 20-Minute Drive That Crosses Two Housing Markets',
    )
    expect(ktPlain('a *b* **c**')).toBe('a b c')
  })
})
