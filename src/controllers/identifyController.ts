import { Request, Response } from 'express';
import prisma from '../prismaClient';

export default async function identifyContact(req: Request, res: Response) {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Email or phoneNumber is required' });
  }

  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined },
      ]
    }
  });

  let primaryContact = null;

  if (contacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'primary'
      }
    });

    return res.status(200).json({
      contact: {
        primaryContatctId: newContact.id,
        emails: [newContact.email].filter(Boolean),
        phoneNumbers: [newContact.phoneNumber].filter(Boolean),
        secondaryContactIds: []
      }
    });
  }

  // find all related contacts
  const allLinkedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined },
        { linkedId: { in: contacts.map(c => c.id) } },
        { id: { in: contacts.map(c => c.linkedId).filter(Boolean) as number[] } },
      ]
    }
  });

  // resolve primary
  const sorted = [...allLinkedContacts].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  primaryContact = sorted.find(c => c.linkPrecedence === 'primary') || sorted[0];

  // add secondary if this combo is new
  const alreadyExists = allLinkedContacts.some(c => c.email === email && c.phoneNumber === phoneNumber);
  if (!alreadyExists) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: 'secondary'
      }
    });
  }

  const finalContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryContact.id },
        { linkedId: primaryContact.id },
        { id: primaryContact.linkedId || -1 },
        { linkedId: primaryContact.linkedId || -1 }
      ]
    }
  });

  const primary = finalContacts.find(c => c.linkPrecedence === 'primary')!;
  const secondaries = finalContacts.filter(c => c.id !== primary.id);

  return res.status(200).json({
    contact: {
      primaryContatctId: primary.id,
      emails: [...new Set([primary.email, ...secondaries.map(s => s.email)].filter(Boolean))],
      phoneNumbers: [...new Set([primary.phoneNumber, ...secondaries.map(s => s.phoneNumber)].filter(Boolean))],
      secondaryContactIds: secondaries.map(s => s.id)
    }
  });
}
