import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesModule } from './activities/activities.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PaymentsModule } from './payments/payments.module';
import { AgreementsModule } from './agreements/agreements.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { ParentsModule } from './parents/parents.module';
import { Teacher } from './teachers/entities/teacher.entity';
import { Activity } from './activities/entities/activity.entity';
import { Student } from './students/entities/student.entity';
import { AttendanceRecord } from './attendance/entities/attendance.entity';
import { Payment } from './payments/entities/payment.entity';
import { Agreement } from './agreements/entities/agreement.entity';
import { User } from './auth/entities/user.entity';
import { Parent } from './parents/entities/parent.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            // ssl: { rejectUnauthorized: false },
            entities: [User, Parent, Teacher, Activity, Student, AttendanceRecord, Payment, Agreement],
            synchronize: true,
            logging: false,
               ssl: {                          // ← ADD THIS BLOCK
      rejectUnauthorized: false     // Required for Neon
    },
    extra: {                        // ← OPTIONAL BUT RECOMMENDED
      ssl: {
        rejectUnauthorized: false
      }
    }
          };
        }
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', '123'),
          database: configService.get('DB_DATABASE', 'guardian_db'),
          entities: [User, Parent, Teacher, Activity, Student, AttendanceRecord, Payment, Agreement],
          synchronize: true,
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ParentsModule,
    TeachersModule,
    ActivitiesModule,
    StudentsModule,
    AttendanceModule,
    PaymentsModule,
    AgreementsModule,
    DashboardModule,
    SeedModule,
  ],
})
export class AppModule {}
