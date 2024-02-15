<template>
  <!-- <UISearchBlock /> -->
  <div>
    <UIImageList v-if="images" :images="images" />
    <SharedSidePanel iconType="stories" label="verhalen">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
        laudantium, quia sapiente sint, commodi porro, ad exercitationem earum
        incidunt eaque deleniti doloremque libero maxime sequi nisi voluptatibus
        non eligendi corrupti explicabo debitis aspernatur eius laborum?
        Distinctio earum ut aliquam exercitationem nemo veniam eos, doloremque
        ea aperiam, labore ducimus tenetur quas alias nesciunt voluptatibus
        omnis fuga fugiat consequuntur totam explicabo inventore quam suscipit
        vitae obcaecati? Distinctio nemo eius iste sint. Aperiam temporibus, ex
        quos labore dignissimos, asperiores est vel magnam exercitationem nisi
        doloribus recusandae earum! Pariatur exercitationem commodi, illo culpa
        ad in explicabo tempore deserunt assumenda facere dolor. Recusandae
        laborum ut autem maiores officiis repellendus necessitatibus placeat rem
        labore laboriosam alias corrupti quasi ab repellat omnis et
        exercitationem saepe amet velit nostrum earum, voluptas voluptatem
        eveniet. Explicabo saepe in libero unde dicta. Rerum animi porro autem!
        Illum eveniet totam iure? Quos, vitae dolores omnis blanditiis nisi
        nobis dolorem itaque pariatur voluptates provident reprehenderit
        necessitatibus corrupti asperiores, natus dolorum esse hic numquam
        debitis, ipsa veritatis sequi placeat praesentium ab. Asperiores aperiam
        aliquam qui ipsa commodi dolor dolorum, non excepturi corrupti debitis
        sint ipsam aut quia iure tempore praesentium adipisci similique?
        Recusandae saepe doloremque laboriosam voluptas eum minima fuga corporis
        distinctio eligendi consectetur numquam illo consequatur vero odio
        possimus placeat ipsum autem eveniet, quas, repudiandae quia reiciendis.
        Sit dignissimos unde deserunt molestiae, vitae ipsum sapiente quos velit
        atque perferendis minus, deleniti id officia asperiores quibusdam culpa
        doloribus ex dolorum repellat! Perspiciatis facilis officia nisi
        blanditiis nihil. A quis dolorem quasi. Accusantium sit dicta quidem
        expedita porro consequuntur aliquam ea odio vero eligendi inventore esse
        obcaecati atque consectetur delectus ratione neque, tempora nemo
        architecto placeat? Nisi quam porro eaque asperiores maxime laborum
        voluptatibus autem unde quas praesentium reprehenderit debitis, id, non
        voluptatum? Ad, ab rerum. Velit, possimus dicta doloribus quis harum
        omnis neque quam.
      </p>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
        laudantium, quia sapiente sint, commodi porro, ad exercitationem earum
        incidunt eaque deleniti doloremque libero maxime sequi nisi voluptatibus
        non eligendi corrupti explicabo debitis aspernatur eius laborum?
        Distinctio earum ut aliquam exercitationem nemo veniam eos, doloremque
        ea aperiam, labore ducimus tenetur quas alias nesciunt voluptatibus
        omnis fuga fugiat consequuntur totam explicabo inventore quam suscipit
        vitae obcaecati? Distinctio nemo eius iste sint. Aperiam temporibus, ex
        quos labore dignissimos, asperiores est vel magnam exercitationem nisi
        doloribus recusandae earum! Pariatur exercitationem commodi, illo culpa
        ad in explicabo tempore deserunt assumenda facere dolor. Recusandae
        laborum ut autem maiores officiis repellendus necessitatibus placeat rem
        labore laboriosam alias corrupti quasi ab repellat omnis et
        exercitationem saepe amet velit nostrum earum, voluptas voluptatem
        eveniet. Explicabo saepe in libero unde dicta. Rerum animi porro autem!
        Illum eveniet totam iure? Quos, vitae dolores omnis blanditiis nisi
        nobis dolorem itaque pariatur voluptates provident reprehenderit
        necessitatibus corrupti asperiores, natus dolorum esse hic numquam
        debitis, ipsa veritatis sequi placeat praesentium ab. Asperiores aperiam
        aliquam qui ipsa commodi dolor dolorum, non excepturi corrupti debitis
        sint ipsam aut quia iure tempore praesentium adipisci similique?
        Recusandae saepe doloremque laboriosam voluptas eum minima fuga corporis
        distinctio eligendi consectetur numquam illo consequatur vero odio
        possimus placeat ipsum autem eveniet, quas, repudiandae quia reiciendis.
        Sit dignissimos unde deserunt molestiae, vitae ipsum sapiente quos velit
        atque perferendis minus, deleniti id officia asperiores quibusdam culpa
        doloribus ex dolorum repellat! Perspiciatis facilis officia nisi
        blanditiis nihil. A quis dolorem quasi. Accusantium sit dicta quidem
        expedita porro consequuntur aliquam ea odio vero eligendi inventore esse
        obcaecati atque consectetur delectus ratione neque, tempora nemo
        architecto placeat? Nisi quam porro eaque asperiores maxime laborum
        voluptatibus autem unde quas praesentium reprehenderit debitis, id, non
        voluptatum? Ad, ab rerum. Velit, possimus dicta doloribus quis harum
        omnis neque quam.
      </p>
    </SharedSidePanel>
  </div>
</template>

<script setup lang="ts">
defineI18nRoute({
  paths: {
    nl: '/',
  },
})

const addressService = useAddressService()

const addressData: any = ref(null) //TODO: fix typing

const images = computed(() => {
  if (!addressData.value) {
    return null
  }

  return addressService.getImagesViewModel(addressData.value.presentData.slider)
})

onMounted(async () => {
  const data = await addressService.getAddressJSONandParse(
    '5a58dacbfbb0dbf25da0a2041a8ae6f4',
  )
  addressData.value = data
})
</script>
