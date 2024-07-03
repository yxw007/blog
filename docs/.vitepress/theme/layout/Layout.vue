<template>
	<Layout>
		<template #doc-after>
			<Giscus repo="yxw007/yxw007.github.io"
							repo-id="MDEwOlJlcG9zaXRvcnkyOTY4MTA2Mjc="
							category="General"
							category-id="DIC_kwDOEbD4g84CgiiK"
							mapping="specific"
							:term="filename"
							strict="1"
							reactions-enabled="1"
							emit-metadata="0"
							input-position="top"
							:theme="isDark ? 'dark' : 'light'"
							lang="en" />
		</template>
	</Layout>
</template>

<script setup>
import DefaultTheme from "vitepress/theme";
import Giscus from "@giscus/vue";
import { useData } from "vitepress";

const { Layout } = DefaultTheme;
const { page, isDark } = useData();
const relativePath = page.value.relativePath;
const filename = relativePath.substring(0, relativePath.lastIndexOf('.'));
</script>

<style scoped></style>
