import {
  AuthTypes,
  Context,
  DAL,
  FindConfig,
  RepositoryService,
} from "@medusajs/types"
import {
  InjectManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { AuthUser } from "@models"

type InjectedDependencies = {
  authUserRepository: DAL.RepositoryService
}

export default class AuthUserService<
  TEntity extends AuthUser = AuthUser
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  AuthUser
)<TEntity> {
  protected readonly authUserRepository_: RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.authUserRepository_ = container.authUserRepository
  }

  @InjectManager("authUserRepository_")
  async retrieveByProviderAndEntityId<TEntityMethod = AuthTypes.AuthUserDTO>(
    entityId: string,
    provider: string,
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    const queryConfig = ModulesSdkUtils.buildQuery<TEntity>(
      { entity_id: entityId, provider },
      { ...config, take: 1 }
    )
    const [result] = await this.authUserRepository_.find(
      queryConfig,
      sharedContext
    )

    if (!result) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `AuthUser with entity_id: "${entityId}" and provider: "${provider}" not found`
      )
    }

    return result
  }
}
