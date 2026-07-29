import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { 
      name, 
      phone, 
      age, 
      gender, 
      education, 
      occupation, 
      serviceCategory,
      purpose 
    } = body;

    // Validasi input mandatory
    if (!name || !phone || !age || !gender || !education || !occupation || !serviceCategory) {
      return NextResponse.json(
        { message: 'Mohon lengkapi semua kolom yang wajib diisi.' },
        { status: 400 }
      );
    }

    // Simpan ke database sesuai pemetaan field di schema.prisma
    const newGuest = await prisma.guestBook.create({
      data: {
        fullName: name,                    // memetakan name ke fullName
        whatsapp: phone,                   // memetakan phone ke whatsapp
        age: parseInt(age, 10),
        gender,                            // Enum Gender (MALE / FEMALE)
        education,                         // Enum Education (SD, SMP, SMA, dll)
        occupation,
        service: serviceCategory,          // memetakan serviceCategory ke service (Enum ServiceCategory)
        customService: purpose || null,   // memetakan purpose ke customService
      },
    });

    return NextResponse.json(
      { 
        message: 'Data buku tamu berhasil disimpan!', 
        data: newGuest 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving guestbook:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat menyimpan data.' },
      { status: 500 }
    );
  }
}