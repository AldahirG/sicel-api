export class AuthUserResource {
	static map(user: any) {
		return {
			id: user.id,
			name: user?.name,
			paternalSurname: user?.paternalSurname,
			maternalSurname: user?.maternalSurname ?? '',
			email: user?.email,
			roles: user?.roles
				.map((i) => i?.role?.name)
				.filter((r) => typeof r === 'string'),
			token: user?.token,
		}
	}
}
