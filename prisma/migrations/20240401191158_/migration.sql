-- AlterTable
ALTER TABLE `lead` MODIFY `genre` VARCHAR(50) NULL,
    MODIFY `formerSchool` VARCHAR(100) NULL,
    MODIFY `country` VARCHAR(60) NULL,
    MODIFY `state` VARCHAR(60) NULL,
    MODIFY `city` VARCHAR(60) NULL,
    MODIFY `asetNameForm` VARCHAR(150) NULL,
    MODIFY `isOrganic` VARCHAR(10) NULL,
    MODIFY `referenceType` VARCHAR(50) NULL,
    MODIFY `referenceName` VARCHAR(150) NULL,
    MODIFY `enrollmentDate` VARCHAR(10) NULL,
    MODIFY `scholarship` VARCHAR(60) NULL,
    MODIFY `enrollmentStatus` VARCHAR(10) NULL,
    MODIFY `admissionSemester` VARCHAR(20) NULL;
