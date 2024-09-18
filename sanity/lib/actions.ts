import { sanityClient } from './client'
import { supabaseClient } from '../../src/utils/supabaseClient'
// @ts-ignore


export function approveDocumentAction(props: any) {
  const isDev = process.env.NODE_ENV === 'development';
  const supabase = supabaseClient();

  return {
    label: 'Approve listing',
    onHandle: async () => {
      console.log('Approving document:', props);
      const { id, published } = props
      // console.log('Approving document:', id, published);

      if (published === undefined || !published) {
        if (typeof window !== 'undefined' && window) {

          window.alert('Document is already published');
          return;
        }
      } else {
        try {
          const query = `*[_type == "needsApproval" && _id == $id][0]`;
          const documentToApprove = await sanityClient.fetch(query, { id });

          if (!documentToApprove) {
            console.error('Document not found');
            return;
          }



          if (documentToApprove && documentToApprove._id) {
            const { data: signUpData, error } = await supabase.auth.admin.createUser(
              {
                email: documentToApprove.userInfo.email,
                password: 'password',
                user_metadata: {
                  name: documentToApprove.userInfo.name,
                  dob: documentToApprove.userInfo.dob || '',
                  phone: documentToApprove.userInfo.phone,
                  role: 'member',
                },
                email_confirm: true,
              }
            )

            if (signUpData.user) {
              const { data: user, error: userError } = await supabase
                .from('listings')
                .insert(
                  {
                    user_id: signUpData.user.id,
                    userInfo: documentToApprove.userInfo,
                    homeInfo: documentToApprove.homeInfo,
                    amenities: documentToApprove.amenities,
                  }
                )
                .select('*');

              const { data: appUserData, error: appUserDataError } = await supabase
                .from('appUsers')
                .insert({
                  id: signUpData.user.id,
                  name: documentToApprove.userInfo.name,
                  email: documentToApprove.userInfo.email,
                  profession: documentToApprove.userInfo.profession,
                  age: documentToApprove.userInfo.age,
                  profileImage: documentToApprove.userInfo.profileImage,
                  role: 'member',
                })

              const { data: resetPasswordEmail, error: resetPasswordEmailError } = await supabase.auth.resetPasswordForEmail(documentToApprove.userInfo.email, {
                redirectTo: isDev ? 'http://localhost:3000/sign-up' : 'https://swom.travel/sign-up',
              })

              console.log('resetPasswordEmail', resetPasswordEmail, 'resetPasswordEmailError', resetPasswordEmailError);

              if (!userError && !appUserDataError && !resetPasswordEmailError) {

                const newDocument = {
                  ...documentToApprove,
                  _id: signUpData.user.id,
                  _type: 'listing',
                };

                const createdListing = await sanityClient.create(newDocument);

                await sanityClient.delete(documentToApprove._id);
                console.log('User created:', user);
                console.log('Document deleted:', documentToApprove._id);
                console.log('Listing approved and moved to listings:', createdListing);
              } else {
                console.error('Error in creating user:', "userError", userError, "appUserDataError", appUserDataError, "appUserData", appUserData, "user", user, "signUpData", signUpData);

              }
            }
          }
        } catch (error) {
          console.error('Error in approving listing:', error);
        }
      }

    }
  }
}

export function improvedDelete(props: any) {
  return {
    label: 'Delete Listing',
    onHandle: async () => {

      if (typeof window !== 'undefined' && window) {
        // delete from supabase tables appUsers and listings
        const { id } = props
        const query = `*[_type == "listing" && _id == $id][0]`;
        const documentToDelete = await sanityClient.fetch(query, { id });

        if (documentToDelete) {
          const supabase = supabaseClient();

          const { data: userData, error: userDataError } = await supabase.from('appUsers').select('id').eq('email', documentToDelete.userInfo.email);

          if (!userData || userData.length === 0) {
            await sanityClient.delete(documentToDelete._id);

          } else {
            console.log('userData', userData);
            const { data, error } = await supabase.auth.admin.deleteUser(
              userData[0].id
            )
            if (error) {
              console.error('Error deleting user:', error);
            } else {
              await sanityClient.delete(documentToDelete._id);
              console.log('User deleted:', data);
            }
          }
        }
      }
    }
  }
}