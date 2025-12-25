# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: Bash("openskills read <skill-name>")
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>arabic-localization</name>
<description>Provides comprehensive Arabic internationalization standards including i18n structure, translation key conventions, and tone variation guidelines for Najdi dialect, Professional Modern, and Modern Standard Arabic (MSA)</description>
<location>project</location>
</skill>

<skill>
<name>auth-supabase</name>
<description>Implements standard Supabase authentication flows including signup, login, password reset, OAuth providers, email verification, and session management with complete security best practices</description>
<location>project</location>
</skill>

<skill>
<name>deploy-render</name>
<description>Provides comprehensive Render.com deployment standards covering environment configuration, database migrations, cron jobs, health checks, log management, and production best practices for web services</description>
<location>project</location>
</skill>

<skill>
<name>deploy-vercel</name>
<description>Provides comprehensive Vercel deployment standards optimized for Next.js applications, covering environment configuration, edge functions, serverless architecture, database integration, cron jobs, and production best practices</description>
<location>project</location>
</skill>

<skill>
<name>rtl-ui</name>
<description>Implements right-to-left (RTL) UI patterns for Arabic interfaces using Tailwind CSS, covering layout direction, icon mirroring, typography, and spacing constraints for bidirectional applications</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
