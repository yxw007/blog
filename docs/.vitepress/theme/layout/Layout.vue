<template>
	<Layout>
		<template #doc-after>
			<!-- 	<Comment
				v-if="
					(theme.commentConfig?.showComment ?? true) &&
					(frontmatter?.showComment ?? true)
				"
				:commentConfig="theme.commentConfig"
				:key="md5(page.relativePath)" /> -->
		</template>
	</Layout>
</template>

<script setup>
import DefaultTheme from "vitepress/theme";
// import md5 from "md5";
import { useData } from "vitepress";
// import Comment from "../components/Comment.vue";

const { Layout } = DefaultTheme;
const { page, theme, frontmatter } = useData();
</script>

<style scoped></style>
