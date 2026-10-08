CREATE POLICY "roles_create_site_user" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND role = 'site_user');

CREATE POLICY "invoice_files_read" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'invoice-documents' AND (
    owner_id = auth.uid()::text OR private.has_role(auth.uid(), 'super_admin') OR private.has_role(auth.uid(), 'site_admin')
  )
);
CREATE POLICY "invoice_files_create" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'invoice-documents' AND owner_id = auth.uid()::text);
CREATE POLICY "invoice_files_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'invoice-documents' AND owner_id = auth.uid()::text) WITH CHECK (bucket_id = 'invoice-documents' AND owner_id = auth.uid()::text);
CREATE POLICY "invoice_files_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'invoice-documents' AND (owner_id = auth.uid()::text OR private.has_role(auth.uid(), 'super_admin')));