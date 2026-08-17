import { describe, expect, it } from 'vitest';
import { ABOUT_CONTACTS, getAboutContactLinkAttributes } from './aboutContactData';

describe('about contact data', () => {
  it('keeps the six public contacts complete and ordered', () => {
    expect(ABOUT_CONTACTS).toHaveLength(6);
    expect(ABOUT_CONTACTS.map(({ id }) => id)).toEqual(['01', '02', '03', '04', '05', '06']);
    expect(ABOUT_CONTACTS.map(({ platform }) => platform)).toEqual([
      'GitHub',
      'X / Twitter',
      'Email',
      '哔哩哔哩',
      '小红书',
      '抖音',
    ]);
  });

  it('uses canonical destinations without tracking parameters', () => {
    ABOUT_CONTACTS.forEach((contact) => {
      expect(contact.href).not.toMatch(/[?&](spm_id_from|xsec_token|xsec_source|from_tab_name)=/);
      if (contact.external) expect(new URL(contact.href).search).toBe('');
    });

    const email = ABOUT_CONTACTS.find(({ iconKey }) => iconKey === 'email');
    expect(email).toMatchObject({ href: 'mailto:mz@easymuzi.cn', external: false });
    expect(ABOUT_CONTACTS.filter(({ external }) => external)).toHaveLength(5);
    expect(getAboutContactLinkAttributes(ABOUT_CONTACTS[0])).toEqual({
      target: '_blank',
      rel: 'noopener noreferrer',
    });
    expect(getAboutContactLinkAttributes(email!)).toEqual({});
  });

  it('does not expose long profile identifiers as visible copy', () => {
    ABOUT_CONTACTS.forEach(({ value }) => {
      expect(value).not.toMatch(/^https?:\/\//);
      expect(value.length).toBeLessThan(32);
    });
  });
});
