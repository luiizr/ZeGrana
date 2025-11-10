export default interface LifeControl {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    integratedAt: Date | null;
    isIntegrated: boolean;
}