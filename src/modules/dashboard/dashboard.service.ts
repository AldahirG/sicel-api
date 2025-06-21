import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransformResponse } from 'src/common/mappers/transform-response';

@Injectable()
export class DashboardService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // Se conecta al iniciar el módulo
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Se desconecta cuando el módulo se destruye
  }

  // Total por status
  async getTotalByStatus() {
    const data = await this.informationLead.groupBy({
      by: ['enrollmentStatus'],
      _count: {
        enrollmentStatus: true,
      },
      orderBy: {
        _count: {
          enrollmentStatus: 'desc',
        },
      },
    });

    return TransformResponse.map(
      data.map((item) => ({
        status: item.enrollmentStatus,
        total: item._count.enrollmentStatus,
      })),
    );
  }

  // Total por ciclo
  async getTotalByCycle() {
    const data = await this.cycles.findMany({
      select: {
        cycle: true,
        _count: {
          select: { leads: true }, // Contar los leads relacionados con cada ciclo
        },
      },
      orderBy: {
        cycle: 'desc',
      },
    });
  
    const result = data.map((cycle) => ({
      cycle: cycle.cycle,
      total: cycle._count.leads || 0, // _count.leads ya es el número total de leads
    }));
  
    return TransformResponse.map(result);
  }
  

  // Total por tipo de escuela (pública/privada)
  async getTotalBySchoolType() {
    const data = await this.informationLead.groupBy({
      by: ['typeSchool'],
      _count: {
        typeSchool: true,
      },
      orderBy: {
        _count: {
          typeSchool: 'desc',
        },
      },
    });

    return TransformResponse.map(
      data.map((item) => ({
        typeSchool: item.typeSchool,
        total: item._count.typeSchool,
      })),
    );
  }

  // Total por porcentaje de beca ofertada
  async getTotalByScholarship() {
    const data = await this.leads.groupBy({
      by: ['scholarship'],
      _count: {
        scholarship: true,
      },
      orderBy: {
        _count: {
          scholarship: 'desc',
        },
      },
    });

    return TransformResponse.map(
      data.map((item) => ({
        scholarship: item.scholarship || 'Sin porcentaje',
        total: item._count.scholarship,
      })),
    );
  }

  // Total por país
  async getTotalByCountry() {
    const data = await this.countries.findMany({
      select: {
        name: true,
        States: {
          select: {
            Cities: {
              select: {
                _count: {
                  select: { Leads: true },
                },
              },
            },
          },
        },
      },
    });
  
    const result = data.map((country) => ({
      country: country.name,
      total: country.States.reduce(
        (sum, state) =>
          sum +
          state.Cities.reduce(
            (citySum, city) => citySum + (city._count.Leads || 0),
            0
          ),
        0
      ),
    }));
  
    return TransformResponse.map(result);
  }  

  // Total por estado
  async getTotalByState() {
    const data = await this.states.findMany({
      select: {
        name: true,
        Cities: {
          select: {
            _count: {
              select: { Leads: true },
            },
          },
        },
      },
    });
  
    const result = data.map((state) => ({
      state: state.name,
      total: state.Cities.reduce((sum, city) => sum + (city._count.Leads || 0), 0),
    }));
  
    return TransformResponse.map(result);
  }

  // Total por ciudad
  async getTotalByCity() {
    const data = await this.cities.findMany({
      select: {
        name: true,
        _count: {
          select: { Leads: true },
        },
      },
    });
  
    const result = data.map((city) => ({
      city: city.name,
      total: city._count.Leads || 0, // _count ya es el número total de leads
    }));
  
    return TransformResponse.map(result);
  }
  
  
  

  // Total por grado académico
  async getTotalByGrade() {
    const data = await this.grades.findMany({
      select: {
        name: true,
        _count: {
          select: { leads: true }, // Contar los leads relacionados con cada grado
        },
      },
      orderBy: {
        name: 'desc',
      },
    });
  
    const result = data.map((grade) => ({
      grade: grade.name,
      total: grade._count.leads || 0, // _count.leads ya es el número total de leads
    }));
  
    return TransformResponse.map(result);
  }
  

  // Total por semestre
  async getTotalBySemester() {
    const data = await this.leads.groupBy({
      by: ['semester'],
      _count: {
        semester: true,
      },
      orderBy: {
        _count: {
          semester: 'asc',
        },
      },
    });

    return TransformResponse.map(
      data.map((item) => ({
        semester: item.semester || 'Sin semestre',
        total: item._count.semester,
      })),
    );
  }

  // Total por tipo de referido
  async getTotalByReferenceType() {
    const data = await this.references.groupBy({
      by: ['type'],
      _count: {
        type: true,
      },
      orderBy: {
        _count: {
          type: 'desc',
        },
      },
    });

    return TransformResponse.map(
      data.map((item) => ({
        referenceType: item.type || 'Sin tipo de referido',
        total: item._count.type,
      })),
    );
  }

  // Total por campaña
  async getTotalByCampaign() {
    const data = await this.campaigns.groupBy({
      by: ['name'],
      _count: {
        name: true,
      },
      orderBy: {
        _count: {
          name: 'desc',
        },
      },
    });

    return TransformResponse.map(
      data.map((item) => ({
        campaign: item.name || 'Sin campaña',
        total: item._count.name,
      })),
    );
  }

  // Total por medio de contacto
  async getTotalByContactMedium() {
    const data = await this.contactTypes.findMany({
      select: {
        name: true,
        _count: {
          select: { asetName: true }, // Contar los registros de asetName relacionados
        },
      },
      orderBy: {
        name: 'desc',
      },
    });
  
    const result = data.map((contactType) => ({
      contactMedium: contactType.name || 'Sin medio de contacto',
      total: contactType._count.asetName || 0, // Contamos los asetName relacionados
    }));
  
    return TransformResponse.map(result);
  }
  


   // promoter dashboard
 // Total por programa
 async getPromoterTotalByProgram(userId: string) {
  const data = await this.grades.findMany({
    where: {
      available: true,
      leads: {
        some: {
          userId: userId, // Filtrar solo los leads asignados a este usuario
          available: true,
        },
      },
    },
    select: {
      name: true,
      _count: {
        select: { leads: true }, // Contar los leads relacionados con este grado
      },
    },
    orderBy: {
      name: 'desc',
    },
  });

  const result = data.map((grade) => ({
    programa: grade.name || 'Sin nombre',
    total: grade._count.leads || 0, // _count.leads ya es el número total de leads
  }));

  return TransformResponse.map(result);
}


// Total por semestre
async getPromoterTotalBySemester(userId: string) {
  const data = await this.leads.groupBy({
    by: ['semester'],
    where: {
      available: true,
      userId: userId,
    },
    _count: {
      semester: true,
    },
    orderBy: {
      _count: {
        semester: 'desc',
      },
    },
  });

  return TransformResponse.map(
    data.map((item) => ({
      semestre: item.semester || 'Sin semestre',
      total: item._count.semester,
    })),
  );
}

// Total por campaña
async getPromoterTotalByCampaign(userId: string) {
  const data = await this.campaigns.groupBy({
    by: ['name'],
    where: {
      available: true,
      Leads: {
        some: {
          userId: userId,
          available: true,
        },
      },
    },
    _count: {
      name: true,
    },
    orderBy: {
      _count: {
        name: 'desc',
      },
    },
  });

  return TransformResponse.map(
    data.map((item) => ({
      campaña: item.name || 'Sin nombre',
      total: item._count.name,
    })),
  );
}

// Total por status
async getPromoterTotalByStatus(userId: string) {
  const data = await this.informationLead.groupBy({
    by: ['enrollmentStatus'],
    where: {
      available: true,
      Lead: { userId: userId },
    },
    _count: {
      enrollmentStatus: true,
    },
    orderBy: {
      _count: {
        enrollmentStatus: 'desc',
      },
    },
  });

  return TransformResponse.map(
    data.map((item) => ({
      status: item.enrollmentStatus || 'Sin status',
      total: item._count.enrollmentStatus,
    })),
  );
}

// Total por ciclo
async getPromoterTotalByCycle(userId: string) {
  const data = await this.cycles.groupBy({
    by: ['cycle'],
    where: {
      available: true,
      leads: {
        some: {
          userId: userId,
          available: true,
        },
      },
    },
    _count: {
      cycle: true,
    },
    orderBy: {
      _count: {
        cycle: 'desc',
      },
    },
  });

  return TransformResponse.map(
    data.map((item) => ({
      ciclo: item.cycle || 'Sin ciclo',
      total: item._count.cycle,
    })),
  );
}

// Total por ciudad
async getPromoterTotalByCity(userId: string) {
  const data = await this.cities.groupBy({
    by: ['name'],
    where: {
      available: true,
      Leads: {
        some: {
          userId: userId,
          available: true,
        },
      },
    },
    _count: {
      name: true,
    },
    orderBy: {
      _count: {
        name: 'desc',
      },
    },
  });

  return TransformResponse.map(
    data.map((item) => ({
      ciudad: item.name || 'Sin ciudad',
      total: item._count.name,
    })),
  );
}

// Total por medio de contacto
async getPromoterTotalByContactType(userId: string) {
  const data = await this.contactTypes.groupBy({
    by: ['name'],
    where: {
      available: true,
      asetName: {
        some: {
          Leads: {
            some: {
              userId: userId,
              available: true,
            },
          },
        },
      },
    },
    _count: {
      name: true,
    },
    orderBy: {
      _count: {
        name: 'desc',
      },
    },
  });

  return TransformResponse.map(
    data.map((item) => ({
      medio_contacto: item.name || 'Sin medio',
      total: item._count.name,
    })),
  );
}

// Total por tipo de escuela
async getPromoterTotalBySchoolType(userId: string) {
  const data = await this.informationLead.groupBy({
    by: ['typeSchool'],
    where: {
      available: true,
      Lead: { userId: userId },
    },
    _count: {
      typeSchool: true,
    },
    orderBy: {
      _count: {
        typeSchool: 'desc',
      },
    },
  });

  return TransformResponse.map(
    data.map((item) => ({
      tipo_escuela: item.typeSchool || 'Sin tipo de escuela',
      total: item._count.typeSchool,
    })),
  );
}

// Total por becas
async getPromoterTotalByScholarship(userId: string) {
  const data = await this.leads.groupBy({
    by: ['scholarship'],
    where: {
      available: true,
      userId: userId, // Filtra por el promotor específico
    },
    _count: {
      scholarship: true,
    },
    orderBy: {
      _count: {
        scholarship: 'desc',
      },
    },
  });

  return TransformResponse.map(
    data.map((item) => ({
      scholarship: item.scholarship || 'Sin porcentaje',
      total: item._count.scholarship,
    })),
  );
}

async getPromoterTotalByFollowUp(userId: string) {
  const data = await this.followUp.findMany({
    select: {
      name: true,
      _count: {
        select: {
          InformationLead: {
            where: {
              Lead: {
                userId: userId, // Filtrar por el usuario específico
                available: true,
              },
            },
          },
        },
      },
    },
    orderBy: {
      name: 'desc',
    },
  });

  const result = data.map((followUp) => ({
    followUp: followUp.name || 'Sin seguimiento',
    total: followUp._count.InformationLead || 0, // _count.InformationLead ya es el número total de leads relacionados
  }));

  return TransformResponse.map(result);
}


}
